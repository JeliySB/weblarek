import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Catalog } from './components/models/Catalog';
import { Cart } from './components/models/Cart';
import { Order } from './components/models/Order';
import { Api } from './components/base/Api';
import { ShopAPI } from './components/models/shopApi';
import { API_URL } from './utils/constants';

const catalog = new Catalog();
const cart = new Cart();
const order = new Order();

//catalog
console.log('Catalog');
catalog.setItems(apiProducts.items);
console.log('Все товары:', catalog.getItems());
console.log('Товар по id:', catalog.getItem(apiProducts.items[3].id)?.title);
catalog.setPreview(apiProducts.items[2]);
console.log('Товар для отображения:', catalog.getPreview()?.title);

//cart
cart.addItem(apiProducts.items[0]);
cart.addItem(apiProducts.items[1]);
cart.addItem(apiProducts.items[2]);

console.log('cart');
console.log('Товары в корзине:', cart.getItems().map(i => i.title));
console.log('Количество товаров:', cart.getCount());
console.log('Общая сумма:', cart.getTotal());
console.log('Есть товар в корзине?', cart.hasItem(apiProducts.items[0].id));

cart.removeItem(apiProducts.items[2].id);
console.log('После удаления товара:', cart.getCount());

cart.clear();
console.log('После очистки корзины:', cart.getItems().length);
console.log('Есть товар в корзине?', cart.hasItem(apiProducts.items[2].id));

//order
order.setPayment('online');
order.setAddress('г. Пупкин');
order.setEmail('email@email.com');
order.setPhone('+799999999');

console.log('Покупатель:', order.getOrderData());
console.log('Валидация:', order.validate());

order.setEmail('');
console.log('Валидация:', order.validate());

order.clear();
console.log('Очистка', order.validate());

//Слой коммуникации
const baseApi = new Api(API_URL);
const shopApi = new ShopAPI(baseApi);

shopApi.getProductList()
  .then(products => {
    console.log('Данные с сервера');
    console.log('Товары:', products.length, 'шт.');
    catalog.setItems(products);
    console.log('Каталог обновлён');
    console.log('Первые пять товаров:', products.slice(0, 5).map(p => p.title));
  })
  .catch(err => {
    console.error('Ошибка', err);
  });
