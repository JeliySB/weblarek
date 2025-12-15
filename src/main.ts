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
import BasketView from './components/view/BasketView';

import { CardCatalog } from './components/view/Card/CardCatalog';
import { CardPreview } from './components/view/Card/CardPreview';
import { CardBasket } from './components/view/Card/CardBasket';

import { OrderForm } from './components/view/Form/OrderForm';
import { ContactForm } from './components/view/Form/ContactForm';
import { Success } from './components/view/Form/Success';

import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IOrder } from './types';

// Инициализация
const api = new ShopAPI(new Api(API_URL));
const events = new EventEmitter();

const catalog = new Catalog();
const cart = new Cart();
const orderModel = new Order();

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Компоненты
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactForm = new ContactForm(cloneTemplate(contactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), events);

// Для мгновенного обновления превью
let currentPreviewCard: CardPreview | null = null;
let currentPreviewItem: IProduct | null = null;

// Данные форм
let orderFormData = {
    payment: null as 'online' | 'cash' | null,
    address: ''
};

let contactFormData = {
    email: '',
    phone: ''
};

// Загрузка каталога
api.getProductList()
    .then(items => {
        catalog.setItems(items);
        events.emit('catalog:changed');
    })
    .catch(err => console.error('Ошибка загрузки каталога:', err));

// Каталог
events.on('catalog:changed', () => {
    const galleryCards = catalog.getItems().map(item => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), () => {
            events.emit('card:select', item);
        });

        return card.render({
            ...item,
            image: item.image ? `${CDN_URL}/${item.image}` : undefined
        });
    });

    page.gallery = galleryCards;
});

// Превью товара
events.on('card:select', (item: IProduct) => {
    const previewElement = cloneTemplate(cardPreviewTemplate);
    const previewCard = new CardPreview(previewElement, () => {
        if (cart.hasItem(item.id)) {
            cart.removeItem(item.id);
        } else {
            cart.addItem(item);
        }
        events.emit('cart:changed');
    });

    currentPreviewCard = previewCard;
    currentPreviewItem = item;

    previewCard.render({
        ...item,
        image: item.image ? `${CDN_URL}/${item.image}` : undefined,
        description: item.description || '',
        inBasket: cart.hasItem(item.id),
        buttonDisabled: item.price === null
    });

    modal.content = previewCard.render();
    modal.open();
    page.locked = true;
});

// Мгновенное обновление кнопки в превью
events.on('cart:changed', () => {
    page.basketCount = cart.getCount();
    renderBasket();

    if (currentPreviewCard && currentPreviewItem) {
        currentPreviewCard.inBasket = cart.hasItem(currentPreviewItem.id);
        currentPreviewCard.buttonDisabled = currentPreviewItem.price === null;
    }
});

// Корзина
events.on('basket:open', () => {
    renderBasket();
    modal.content = basketView.render();
    modal.open();
    page.locked = true;
});

function renderBasket() {
    const basketCards = cart.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), () => {
            cart.removeItem(item.id);
            events.emit('cart:changed');
        });

        return card.render({
            ...item,
            image: item.image ? `${CDN_URL}/${item.image}` : undefined,
            index
        });
    });

    basketView.items = basketCards;
    basketView.total = cart.getTotal();
    basketView.valid = cart.getCount() > 0;
}

// Оформление
events.on('basket:order', () => {
    orderFormData = { payment: null, address: '' };
    updateOrderForm();

    modal.content = orderForm.render({
        valid: false,
        errors: {},
        payment: null,
        address: ''
    });
    modal.open();
    page.locked = true;
});

// Изменения в форме оплаты
events.on('order:change', (data: { field: 'payment' | 'address', value: string }) => {
    if (data.field === 'payment') {
        orderFormData.payment = data.value as 'online' | 'cash';
        orderModel.setPayment(data.value as 'online' | 'cash');
    } else if (data.field === 'address') {
        orderFormData.address = data.value;
        orderModel.setAddress(data.value);
    }

    updateOrderForm();
});

function updateOrderForm() {
    const errors: Record<string, string> = {};

    if (orderFormData.payment === null) {
        errors.payment = 'Выберите способ оплаты';
    }

    if (!orderFormData.address.trim()) {
        errors.address = 'Необходимо указать адрес доставки';
    }

    const isValid = Object.keys(errors).length === 0;

    orderForm.render({
        valid: isValid,
        errors,
        payment: orderFormData.payment,
        address: orderFormData.address
    });
}

// Переход к контактам
events.on('order:submit', () => {
    contactFormData = { email: '', phone: '' };
    updateContactForm();

    modal.content = contactForm.render({
        valid: false,
        errors: {},
        email: '',
        phone: ''
    });
});

// Изменения в форме контактов
events.on('contacts:change', (data: { field: 'email' | 'phone', value: string }) => {
    if (data.field === 'email') {
        contactFormData.email = data.value;
        orderModel.setEmail(data.value);
    } else if (data.field === 'phone') {
        contactFormData.phone = data.value;
        orderModel.setPhone(data.value);
    }

    updateContactForm();
});

function updateContactForm() {
    const errors: Record<string, string> = {};

    if (!contactFormData.email.trim()) {
        errors.email = 'Необходимо указать email';
    }

    if (!contactFormData.phone.trim()) {
        errors.phone = 'Необходимо указать телефон';
    }

    const isValid = Object.keys(errors).length === 0;

    contactForm.render({
        valid: isValid,
        errors,
        email: contactFormData.email,
        phone: contactFormData.phone
    });
}


// Отправка заказа
events.on('contacts:submit', () => {
    const fullOrder: IOrder = {
        ...orderModel.getOrderData(),
        items: cart.getItems().map(item => item.id),
        total: cart.getTotal()
    };

    api.sendOrder(fullOrder)
        .then(() => {
            modal.content = successView.render({ total: cart.getTotal() });
            modal.open();

            cart.clear();
            orderModel.clear();
            events.emit('cart:changed');
        })
        .catch(err => console.error('Ошибка отправки заказа:', err));
});

// Закрытие успеха
events.on('success:close', () => {
    modal.close();
    page.locked = false;
});

// Закрытие модалки + сброс превью
events.on('modal:close', () => {
    page.locked = false;
    currentPreviewCard = null;
    currentPreviewItem = null;
});