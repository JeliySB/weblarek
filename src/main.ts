import './scss/styles.scss';

import { ShopAPI } from './components/models/shopapi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Catalog } from './components/models/catalog';
import { Cart } from './components/models/cart';
import { Order } from './components/models/order';
import { Page } from './components/view/Page';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import { CardCatalog } from './components/view/Card/CardCatalog';
import { CardPreview } from './components/view/Card/CardPreview';
import { CardBasket } from './components/view/Card/CardBasket';
import BasketView from './components/view/BasketView';
import { OrderForm } from './components/view/Form/OrderForm';
import { ContactForm } from './components/view/Form/ContactForm';
import { Success } from './components/view/Form/Success';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IOrder } from './types';

//

let currentPreviewCard: CardPreview | null = null;
const events = new EventEmitter();
const api = new ShopAPI(new Api(API_URL));

const catalog = new Catalog(events);
const cart = new Cart(events);
const order = new Order(events);

const header = new Header(ensureElement<HTMLElement>('.header'), events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basketView = new BasketView(cloneTemplate('#basket'), events);
const orderForm = new OrderForm(cloneTemplate('#order'), events);
const contactForm = new ContactForm(cloneTemplate('#contacts'), events);
const successView = new Success(cloneTemplate('#success'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

// Загружаем каталог
api.getProductList()
    .then(items => catalog.setItems(items))
    .catch(err => console.error('Ошибка загрузки каталога:', err));

// Каталог
events.on('catalog:changed', () => {
    page.gallery = catalog.getItems().map(item => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
        return card.render(item);
    });
});

events.on('card:select', ({ id }: { id: string }) => {
    const item = catalog.getItem(id);
    if (item) catalog.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
    currentPreviewCard = card;

    modal.content = card.render({
        ...item,
        description: item.description,
        inBasket: cart.hasItem(item.id),
        buttonDisabled: item.price === null
    });
    modal.open();
    page.locked = true
});

//переключаетль 
events.on('card:in-basket-toggle', ({ id }: { id: string }) => {
    const item = catalog.getItem(id);
    if (!item) return;

    if (cart.hasItem(id)) {
        cart.removeItem(id);
    } else {
        cart.addItem(item);
    }
});

// Коризина
events.on('basket:item:remove', ({ id }: { id: string }) => {
    cart.removeItem(id);
});

events.on('cart:changed', () => {
    // счетчик пененсен в header
    header.basketCount = cart.getCount();

    const items = cart.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
        return card.render({
            ...item,
            index
        });
    });

    basketView.items = items;
    basketView.total = cart.getTotal();
    basketView.valid = cart.getCount() > 0;

    if (currentPreviewCard) {
        const previewItem = catalog.getPreview();
        if (previewItem) {
            currentPreviewCard.inBasket = cart.hasItem(previewItem.id);
            currentPreviewCard.buttonDisabled = previewItem.price === null;
        }
    }
});

events.on('basket:open', () => {
    const items = cart.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
        return card.render({
            ...item,
            index
        });
    });

    basketView.items = items;
    basketView.total = cart.getTotal();
    basketView.valid = cart.getCount() > 0;

    modal.content = basketView.render({});
    modal.open();
    page.locked = true;
});

// Заказ
events.on('basket:order', () => {
    order.clear();

    const data = order.getOrderData();
    modal.content = orderForm.render({
        valid: order.isValidStep1(),
        errors: order.validateStep1(),
        payment: data.payment,
        address: data.address
    });
    modal.open();
    page.locked = true;
});

events.on('order:change', (data: { field: string; value: string }) => {
    if (data.field === 'payment') {
        order.setPayment(data.value as 'online' | 'cash');
    } else if (data.field === 'address') {
        order.setAddress(data.value);
    }
});

events.on('contacts:change', (data: { field: string; value: string }) => {
    if (data.field === 'email') {
        order.setEmail(data.value);
    } else if (data.field === 'phone') {
        order.setPhone(data.value);
    }
});

function renderOrderForm() {
    const data = order.getOrderData();
    orderForm.render({
        valid: order.isValidStep1(),
        errors: order.validateStep1(),
        payment: data.payment,
        address: data.address
    });
}

function renderContactForm() {
    const data = order.getOrderData();
    contactForm.render({
        valid: order.isValidStep2(),
        errors: order.validateStep2(),
        email: data.email,
        phone: data.phone
    });
}

events.on('order:changed', () => {
    renderOrderForm();
    renderContactForm();
});

events.on('order:submit', () => {
    const data = order.getOrderData();
    modal.content = contactForm.render({
        valid: order.isValidStep2(),
        errors: order.validateStep2(),
        email: data.email,
        phone: data.phone
    });
});

events.on('contacts:submit', () => {
    const fullOrder: IOrder = {
        ...order.getOrderData(),
        items: cart.getItemIds(),
        total: cart.getTotal()
    };

    api.sendOrder(fullOrder)
        .then(res => {
            modal.content = successView.render({ total: res.total });
            cart.clear();
            order.clear();
        })
        .catch(err => console.error('Ошибка отправки заказа:', err));
});

// Успешно
events.on('success:close', () => {
    modal.close();
    page.locked = false;
});


events.on('modal:close', () => {
    currentPreviewCard = null;
    page.locked = false;
});
events.on('modal:open', () => page.locked = true);
