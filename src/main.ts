import './scss/styles.scss';

import { ShopAPI } from './components/models/shopapi';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Catalog } from './components/models/catalog';
import { Cart } from './components/models/cart';
import { Order } from './components/models/order';
import { Page } from './components/view/Page';
import { Modal } from './components/view/Modal';
import { CardCatalog } from './components/view/Card/CardCatalog';
import { CardPreview } from './components/view/Card/CardPreview';
import { CardBasket } from './components/view/Card/CardBasket';
import { OrderForm } from './components/view/Form/OrderForm';
import { ContactForm } from './components/view/Form/ContactForm';
import { Success } from './components/view/Form/Success';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IOrder } from './types';
import BasketView from './components/view/BasketView';

//
const events = new EventEmitter();
const api = new ShopAPI(new Api(API_URL));

const catalog = new Catalog(events);
const cart = new Cart(events);
const order = new Order(events);

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
    .catch(err => console.error(err));

// Каталог
events.on('catalog:changed', () => {
    page.gallery = catalog.getItems().map(item => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);

        return card.render({
            ...item,
            image: item.image ? `${CDN_URL}${item.image}` : ''
        });
    });
});

events.on('card:select', (item: IProduct) => {
    catalog.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), events);

    modal.content = card.render({
        ...item,
        image: item.image ? `${CDN_URL}${item.image}` : '',
        description: item.description,
        inBasket: cart.hasItem(item.id),
        buttonDisabled: item.price === null
    });

    modal.open();
    page.locked = true;
});

// Коризина
events.on('card:in-basket-toggle', (item: IProduct) => {
    if (cart.hasItem(item.id)) {
        cart.removeItem(item.id);
    } else {
        cart.addItem(item);
    }
});

events.on('basket:item:remove', (item: IProduct) => {
    cart.removeItem(item.id);
});


events.on('cart:changed', () => {
    page.basketCount = cart.getCount();

    const items = cart.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
        return card.render({
            ...item,
            image: item.image ? `${CDN_URL}${item.image}` : '',
            index
        });
    });

    basketView.items = items;
    basketView.total = cart.getTotal();
    basketView.valid = cart.getCount() > 0;
});

events.on('basket:open', () => {
    modal.content = basketView.render({});
    modal.open();
    page.locked = true;
});

// Заказ
events.on('basket:order', () => {
    order.clear();
    modal.content = orderForm.render({
        valid: false,
        errors: order.validateStep1()
    });
    modal.open();
    page.locked = true;
});

events.on('order:change', () => {
    orderForm.render({
        valid: order.isValidStep1(),
        errors: order.validateStep1()
    });
});

events.on('order:submit', () => {
    modal.content = contactForm.render({
        valid: false,
        errors: order.validateStep2()
    });
});

events.on('contacts:change', () => {
    contactForm.render({
        valid: order.isValidStep2(),
        errors: order.validateStep2()
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
            successView.render({ total: res.total });
            modal.content = successView.render({ total: res.total })
            cart.clear();
            order.clear();
        })
        .catch(err => console.error(err))
});

// Успешно
events.on('success:close', () => {
    modal.close()
    page.locked = false;
});

// Модальное окно
events.on('modal:open', () => page.locked = true)
events.on('modal:close', () => page.locked = false)