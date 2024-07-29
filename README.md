# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


# Паттерн MVP (Model-View-Presenter)

# Model
Модель отвечает за управление данными приложения. Она содержит бизнес-логикой, правила валидации и логику работы с API.

### Интерфейсы:

 - Category
 - ICardItem
 - ICardList
 - IOrderContacts
 - IOrderPayments
 - IOrder
 - IOrderResult
 - FormErrors

### Абстрактные классы:

 - Model:
Основной класс для создания моделей данных.
Метод emitChanges(), который уведомляет об изменениях.

### Классы:

 - AppState:
Управляет состоянием приложения: заказы, товары, ошибки форм и корзина.
Основные методы: setOrderPayment, setOrderAddress, setCatalog, setPreview, setButtonText, getCardsInBasket, getBasketItemIndex, toggleCardInBasket, deleteCardFromBasket, clearBasket, getTotal, setOrderField, validateOrder.

 - Класс Api:
Обеспечивает взаимодействие с сервером через HTTP-протокол.
Методы get, post, handleResponse.

 - Класс LarekApi:
Наследует функциональность класса Api.
Методы для получения товаров и отправки информации о заказе.


# View
Вьюха отвечает за отображение данных и взаимодействие с пользователем. Она включает в себя компоненты интерфейса.

 ### Абстрактные классы:

 - Component:
Основной класс для работы с HTML-элементами.
Методы toggleClass, setText, setImage, render.

### Классы:
 - Card:
Создает карточку товара, заполняет ее данные и добавляет обработчики событий.
 - BasketItem:
Управляет товаром в корзине, наследуется от класса Card.
 - Page:
Управляет элементами страницы: счетчиком товаров, каталогом, корзиной и блокировкой прокрутки.
 - Form:
Хранит информацию о форме, управляет ошибками валидации и подписывается на изменения в инпутах.
 - Modal:
Открывает и закрывает модальное окно, рендерит его содержимое.
 - Success:
Управляет отображением успешного подтверждения заказа.
 - Basket:
Управляет содержимым корзины и отображает итоговую сумму и кнопки для оформления заказа.

# Presenter
Презентер служит связующим звеном между моделью и представлением. Он обрабатывает пользовательский ввод, взаимодействует с моделью и обновляет представление на основе данных.
Реализовано с помощью отдельных классов или методов в классах, таких как Form, Basket, OrderPayments, и OrderContacts, которые взаимодействуют с AppState и обновляют View в соответствии с бизнес-логикой. 
Например, эти классы могут:
 - Инициировать валидацию данных, обрабатывая ввод пользователя и взаимодействуя с AppState для выполнения методов validateOrder(), setOrderField().
 - Отправлять данные заказа на сервер через методы класса LarekApi и обновлять представление в случае успешного оформления заказа.
 - Обновлять состояние формы (отображение ошибок, управлять кнопками), опираясь на данные из AppState.

# Подробное описание:

- Category
Перечисление, описывающее возможные категории товаров.
   - enum Category {
   - 	'софт-скил',
   - 	'другое',
   - 	'дополнительное',
   - 	'кнопка',
   - 	'хард-скил',
   - }

 - ICardItem
Интерфейс, который определяет свойства карточки товара, включая: идентификатор (Id), название, описание, изображение, категорию (из типа Category), цену и текст кнопки на карточке.
   - id: string;                 // Уникальный идентификатор карточки
   - title: string;              // Название товара
   - description?: string;       // Описание товара (опционально)
   - image?: string;             // Ссылка на изображение товара (опционально)
   - category?: Category;        // Категория товара (опционально)
   - price: number || null;      // Цена товара
   - buttonName?: string;        // Текст на кнопке карточки (опционально)

 - ICardList
Интерфейс, представляющий массив карточек товаров и общее количество карточек, полученных с сервера.
   - total: number;           
   - items: ICardItem[];


 - IOrderContacts
Интерфейс для формы ввода данных покупателя, включает поля для телефона и электронной почты.
   - email: string;          // Номер телефона
   - phone: string;          // Электронная почта

 - IOrderPayments
Интерфейс для формы заполнения информации об оплате и доставке. В него входят способ оплаты и адрес доставки.
   - payment: string;
   - address: string;

 - IOrder
Интерфейс, который собирает всю информацию о заказе, расширяет интерфейсы IOrderContacts и IOrderPayments, добавляя общую сумму заказа и массив идентификаторов (Id) приобретенных товаров.
   - interface IOrder extends IOrderContacts, IOrderPayments {
   - total: number;
   - items: string[];
   - }

 - IOrderResult
Интерфейс, который описывает ответ системы в случае успешного оформления заказа, включает идентификатор заказа и общую сумму заказа.
   - id: string;
   - total: number;


 - FormErrors
Тип, который содержит ошибки заполнения полей заказа, где ключами являются свойства интерфейса IOrder, а значениями — строки с описанием ошибок.

 - Абстрактный класс Model
Класс Model служит основой для создания моделей данных. Он принимает два параметра в своем конструкторе: объект, содержащий данные, и набор событий. В модели реализован метод emitChanges(), который отвечает за уведомление об изменениях, и принимает два аргумента — событие и объект данных.

 - Абстрактный класс Component
Класс Component предназначен для работы с HTML-элементами и принимает в конструкторе элемент-контейнер. В классе реализованы следующие методы:
   - toggleClass: Этот метод управляет классами HTML-элемента — он может добавлять или убирать указанный класс, принимает параметры: HTML элемент, название класса (className), а также опциональный параметр force, который указывает, следует ли добавлять или удалять класс.
   - setText: Метод устанавливает текстовое содержимое для указанного HTML-элемента, принимая в качестве аргументов сам элемент и строковое значение, которое будет присвоено свойству textContent.
   - setImage: Данный метод используется для обновления атрибутов изображения в HTML. Он принимает элемент изображения и значение src (путь к изображению), а также, при желании, альтернативный текст для изображения.
   - render: Этот метод отвечает за добавление опциональных данных к объекту и возвращает HTML-элемент контейнера.
Таким образом, классы Model и Component создают основу для работы с данными и визуальными элементами веб-приложения, обеспечивая возможность управления состоянием и представлением.

 - Интерфейс IEvents включает в себя следующие методы:
   - on: используется для назначения обработчика на определённое событие;
   - emit: инициирует событие с переданными данными;
   - trigger: вызывает событие при его активации.

 - Класс EventEmitter, который реализует интерфейс IEvents, включает реализацию методов on, emit и trigger. Кроме этого, класс предоставляет дополнительные функции:
   - off: позволяет удалить обработчик для конкретного события;
   - onAll: устанавливает обработчик для всех событий;
   - offAll: снимает все установленные обработчики.


 - Класс Api обеспечивает взаимодействие приложения с сервером через HTTP-протокол. Он содержит атрибут конфигурации, который включает в себя URL-адрес сервера и базовые заголовки для запросов. А именно, класс имеет следующие свойства:
   * baseUrl: string; // основной адрес сервера
   * options: RequestInit; // параметры HTTP-запроса
   * handleResponse: (response: Response) => Promise<object>; // отвечает за обработку ответа от сервера
   * get: (uri: string) => Promise<object>; // выполняет GET-запрос
    * post: (uri: string, data: object, method: ApiPostMethods = 'POST') => Promise<object>; // выполняет POST-запрос
   Реализовывает методы:
 * get для получения с сервера, принимающий параметр uri,
 * post для отправки данных на сервер, принимающий uri ссылку, объект данных и метод запроса, а также метод handleResponse для обработки полученного ответа от сервера в методах get и post. Конструктор класса принимает базовый URL запроса, также опции запроса и присваивает их соответствующим параметрам объекта класса.
     
Класс LarekApi наследует функциональность класса Api. В его конструктор передаются два параметра: URL CDN и базовый URL.
* Метод для извлечения массива объектов товаров, который создает полные URL для изображений, используя URL CDN и значение по ключу "image" в объекте товара.
*Метод для отправки информации о заказе на сервер.

- Класс AppState, наследующий от класса Model, управляет состоянием приложения, включая информацию о заказах, каталогах товаров, ошибках форм, карточках для превью и корзине. Он включает в себя следующие методы:
   - setOrderPayment: устанавливает способ оплаты для заказа.
   - setOrderAddress: задает адрес доставки заказа.
   - setCatalog: добавляет карточки товаров в каталог из переданного массива.
   - setPreview: определяет ID карточки, выбранной для предварительного просмотра.
   - setButtonText: изменяет текст кнопки для добавления карточки в корзину.
   - getCardsInBasket: возвращает массив карточек, добавленных в корзину.
   - getBasketItemIndex: находит индекс карточки в корзине по её позиции.
   - toggleCardInBasket: добавляет товар в корзину или удаляет его, если он уже там присутствует.
   - deleteCardFromBasket: удаляет конкретный товар из корзины.
   - clearBasket: очищает информацию о заказе и корзине.
   - getTotal: рассчитывает и возвращает общую стоимость товаров в корзине.
   - setOrderField: устанавливает значения для полей заказа, таких как адрес, телефон и email.
   - validateOrder: проверяет заполненность полей заказа и выводит уведомление о пустых полях.
Таким образом, AppState управляет ключевыми аспектами работы приложения, связанными с покупками и заказами.

- Класс `Card` является наследником абстрактного класса `Component` и отвечает за создание карточки товара. Он находит элементы в шаблоне карточки и заполняет их соответствующими данными, такими как идентификатор, заголовок, описание, изображение, категория и цена товара. Также класс добавляет обработчик события клика на кнопку (если она присутствует) или на сам контейнер карточки. Для работы с параметрами предусмотрены сеттеры и геттеры.

- Класс `BasketItem`, который расширяет `Card`, работает с элементами шаблона карточки товара, находящегося в корзине. Он выполняет аналогичные функции по присвоению значений, а также содержит метод-сеттер для установки порядкового индекса товара в корзине.

- Класс `Page`, также наследующий от абстрактного класса `Component`, управляет элементами страницы: счетчиком товаров в корзине, каталогом товаров, самой корзиной и оберткой для блокировки прокрутки при открытии модального окна. В классе есть сеттеры для изменения значения счетчика корзины, изменения содержимого каталога товаров и блокировки прокрутки страницы.

- Класс `Form`, продолжающий идею абстрактного класса `Component`, хранит информацию о кнопке отправки формы и полях, предназначенных для отображения ошибок валидации. В конструкторе класса происходит поиск необходимых HTML элементов в переданном контейнере и установка обработчиков событий для кнопок и полей ввода. Класс содержит сеттеры для управления состоянием кнопки отправки (включение/выключение при наличии ошибок) и для присвоения значений ошибок соответствующим HTML элементам. Также в нем определены методы `onInputChange`, который создает событие при изменении данных в инпуте, и `render`, предназначенный для отрисовки ошибок валидации формы.


- Класс OrderPayments, который наследует от класса Form, управляет кнопками, позволяющими выбирать способ оплаты. Он устанавливает обработчики для кликов на эти кнопки. Также предоставляет метод для установки значения поля адреса доставки заказа. Включает два метода:
   - togglePayment - переключает класс у нажатой кнопки,
   - cancelPayment - сбрасывает состояние всех кнопок.
   - Класс OrderContacts, также наследующий от Form, осуществляет установку значений для поля телефона и электронной почты через специальные сеттеры.

 - Класс Modal, который расширяет абстрактный класс Component, включает методы для открытия и закрытия модального окна, сеттер для установки содержимого окна и метод render для отображения его содержимого и открытия.

 - Класс Success, унаследованный от абстрактного класса Component, отвечает за управление HTML-элементами, такими как кнопка закрытия и текстовое описание. Конструктор этого класса присваивает HTML элементы описания и кнопки соответствующим параметрам, и создает обработчик кликов для кнопки закрытия. Также он содержит сеттер total для установки значения общей суммы подтвержденного заказа.

 - Класс Basket, тоже унаследованный от абстрактного класса Component, управляет блоком, в который помещаются заказываемые товары, а также полями для отображения итоговой суммы всех товаров в корзине и кнопками для оформления заказа. Конструктор класса связывает HTML элементы с соответствующими параметрами.

В классе также реализованы сеттеры:

 - items - для установки карточек товаров из предоставленного массива в блок (list), а в случае пустой корзины — уведомляет пользователя о ее пустоте и управляет состоянием кнопки для оформления заказа.
 - total - для установки значения суммы товаров в корзине в соответствующее поле.  

Получив массив карточек с сервера, мы отображаем их в галерее по событию. При клике на карточку открывается модальное окно с её данными. Если нажать кнопку "В корзину", товар добавляется или удаляется из неё, если он уже присутствует. Модальное окно можно закрыть, кликнув вне его области или на крестик. При оформлении заказа открывается новое модальное окно для выбора способа оплаты и указания адреса доставки. Если какие-то поля не заполнены, переход к следующему шагу блокируется. Затем заполняются поля для указания электронной почты и телефона. Если ошибок нет, заказ отправляется на сервер. При успешной отправке появляется модальное окно с уведомлением об успешном оформлении заказа и сумме покупки, а корзина очищается.
