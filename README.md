# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

Товар
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

Покупатель
interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

interface IOrder extends IBuyer {
  items: string[];
  total: number;
}

### Класс Catalog
Хранение товаров, которые можно купить в приложении. Хранит массив всех товаров, хранит товар, выбранный для подробного отображения;

Конструктор класса не принимает параметров.

Поля класса:
`private _items: IProduct[]` - массив всех товаров из каталога.
`private _preview: string | null` - товар, выбранный для подробного отображения.

Методы класса:
`setItems(items: IProduct[]): void` - сохранение массива товаров полученного в параметрах метода.
`getItems(): IProduct[]` - получение массива товаров из модели.
`getItem(id: string): IProduct | undefined` - получение одного товара по его id.
`setPreview(item: IProduct): void` - сохранение товара для подробного отображения.
`getPreview(): IProduct | undefined` - получение товара для подробного отображения.

### Класс Cart
Хранение товаров, которые пользователь выбрал для покупки

Конструктор класса не принимает параметров.

Поля класса:
`private _items: IProduct[]` - хранит массив товаров, выбранных покупателем для покупки.

Методы класса:
`getItems(): IProduct[]` - получение массива товаров, которые находятся в корзине.
`addItem(item: IProduct): void` - добавление товара, который был получен в параметре, в массив корзины.
`removeItem(id: string): void` - удаление товара, полученного в параметре из массива корзины.
`clear(): void` - очистка корзины.
`getTotal(): number` - получение стоимости всех товаров в корзине.
`getCount(): number` - получение количества товаров в корзине;
`hasItem(id: string): boolean` - проверка наличия товара в корзине по его id, полученного в параметр методаю

### Класс Order
Данные покупателя, которые тот должен указать при оформлении заказа.

Конструктор класса не принимает параметров.

Поля класса:
`private _payment: TPayment | null` - вид оплаты.
`private _address: string` - адреc.
`private _phone: string` - телефон.
`private _email: string` - email.

Методы класса:
`setPayment(method: TPayment): void` - сохранение данных.
`setAddress(address: string): void` - сохранение данных.
`setPhone(phone: string): void`- сохранение данных.
`setEmail(email: string): void` - сохранение данных.
`getOrderData(): IBuyer` - получение всех данных покупателя;
`clear(): void` - очистка данных покупателя.
`validate(): Record<string, string>` - валидация данных.

## Слой коммуникации

### Класс ShopApi
Этот класс будет использовать композицию, чтобы выполнить запрос на сервер с помощью метода get класса Api и будет получать с сервера объект с массивом товаров.

Конструктор:
`constructor(api: Api)` - В конструктор передается API.

Методы класса:
`getProductList(): Promise<IProduct[]>` - делает get запрос на эндпоинт /product/ и возвращает массив товаров.
`sendOrder(order: IOrder): Promise<object>` - делает post запрос на эндпоинт /order/ и передаёт в него данные, полученные в параметрах метода..

## Слой представления (View)

### Класс Page
Управление главной страницей приложения.

Конструктор:
`constructor(container: HTMLElement)`

Поля класса:
`counter: HTMLElement` - счётчик количества товаров в корзине.
`gallery: HTMLElement` - контейнер для карточек каталога.
`basketButton: HTMLElement` - кнопка открытия корзины.

Методы класса:
`setCounter(value: number): void` - обновляет текст счётчика.
`renderCards(cards: HTMLElement[]): void` - заменяет содержимое галереи на массив карточек.

### Класс Card
Базовый класс. Содержит заголовок, цену, изображение, категории, кнопки действия.

Конструктор:
`constructor(container: HTMLElement, actions?: { onClick?: (event: MouseEvent) => void })`

Поля класса:
`protected _title: HTMLElement` - название.
`protected _price: HTMLElement` - цена.
`protected _image?: HTMLImageElement` - изображение.
`protected _category?: HTMLElement` - категория.
`protected _button?: HTMLButtonElement` - кнопка.
`protected _description?: HTMLElement` - описание.

Сеттеры класса:
`set title(value: string)`
`set price(value: number | null)`
`set image(value: string)`
`set category(value: string)`
`set buttonTitle(value: string)`
`set disabled(value: boolean)`

### Класс CardCatalog
Наследуйемый класс от Card. Карточка товара в каталоге.

События класса:
`card:select` - выбор карточки.

### Класс CardPreview
Наследуйемый класс от Card. Карточка в модальном окне.

Поля класса:
`description: HTMLElement` - описание товара
`actionButton: HTMLButtonElement` - кнопка Купить, Удалить из корзины.

Сеттеры класса:
`set description(value: string)`

События класса:
`card:add` - нажатие кнопки «В корзину».
`card:remove` - нажатие кнопки «Удалить из корзины».

### Класс CardBasket
Наследуйемый класс от Card. Карточка товара в корзине.

Поля класса:
`index: HTMLElement`- порядковый номер товара в корзине.
`removeButton: HTMLButtonElement` - кнопка удаления.

Сеттеры класса:
`set index(value: number)`

События класса:
`card:remove` — нажатие кнопки удаления из корзины.

### Класс Modal
Управление модальным окном.

Конструктор:
`constructor(container: HTMLElement)`

Поля класса:
`container: HTMLElement` - элемент модального окна (modal)
`content: HTMLElement` - контейнер (modal__content)
`closeButton: HTMLButtonElement` - крестик

Методы класса:
`set content(value: HTMLElement)` - вставляет контент
`open(): void` - добавляет класс modal_active, блокирует скролл страницы
`close(): void` - убирает класс
`render(data?: object): HTMLElement` - возвращает container

События класса:
`modal:close` - клик по крестику или за карточкой. 

### Класс BasketView
Отображение модального окна корзины, списка товаров, общей суммы.

Поля класса:
`list: HTMLElement` - список товаров
`total: HTMLElement` - общая стоимость
`orderButton: HTMLButtonElement` - кнопка Оформить
`emptyMessage?: HTMLElement` - текст Корзина пуста

Методы класса:
`set total(value: number)` - товаров в корзине.
`set items(value: HTMLElement[])` - вставляет карточки в список
`set valid(value: boolean)` - активирует/отключает кнопку оформления

События класса:
`basket:order` - нажатие кнопки Оформить

### Класс Form<T>
Базовый класс. Общий функционал для форм оформления заказа.

Конструктор:
`constructor(container: HTMLFormElement)`

Поля класса:
`submitButton: HTMLButtonElement` - подтверждение.
`errors: HTMLElement` - блок с сообщениями об ошибках.

Методы класса:
`set valid(value: boolean)` - активирует/отключает кнопку submit
`set errors(value: Record<string, string>)` - отображает ошибки.

События класса:
`form:change` - изменение поля формы

### Класс OrderForm
Наследуйемый класс от Form. Первый шаг оформления — выбор оплаты и адрес доставки.

Поля класса:
`addressInput: HTMLInputElement` - адрес.
`paymentButtons: HTMLButtonElement[]` — кнопки выбора оплаты (online/cash)

Методы класса:
`set payment(value: TPayment)` — выделяет выбранную кнопку.
`set address(value: string)` - адресс.

События класса:
`order:next` - нажатие кнопки «Далее»

### Класс ContactForm
Наследуйемый класс от Form. Второй шаг оформления — email и телефон.

Поля класса:
`emailInput: HTMLInputElement` - email
`phoneInput: HTMLInputElement` - телефонв.

Методы класса:
`set email(value: string)`
`set phone(value: string)`

События класса:
`order:submit` — нажатие кнопки Оплатить

### Класс Success
Успешное оформление заказа.

Поля класса:
`total: HTMLElement` — сумма заказа
`description: HTMLElement` — текст с id заказа
`closeButton: HTMLButtonElement` - закрыть

Методы класса:
`set total(value: number)`

События класса:
`success:close` - нажатие кнопки закрытия

## События приложения

### События View
`card:select` — выбор карточки в каталоге
`card:add` — добавить товар в корзину
`card:remove` — удалить товар из корзины
`basket:order` — перейти к оформлению заказа
`order:next` — перейти к форме контактов
`order:submit` — завершить заказ
`modal:close` — закрытие модального окна
`form:change` — изменение полей формы
`success:close` — закрытие окна успеха

### События Model
`catalog:changed` — изменился каталог товаров
`preview:changed` — изменился выбранный для просмотра товар
`cart:changed` — изменилось содержимое корзины
`order:changed` — изменились данные покупателя