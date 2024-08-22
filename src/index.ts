import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { Page } from './components/Page';
import { Card, BasketItem } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { ICardItem, IOrder } from './types';
import { OrderContacts } from './components/OrderContacts';
import { OrderPayments } from './components/OrderPayments';
import { Success } from './components/common/Success';

// Создание события и API
const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

// Подготовка шаблонов
const templates = {
  cardCatalogTemplate: ensureElement<HTMLTemplateElement>('#card-catalog'),
  cardPreviewTemplate: ensureElement<HTMLTemplateElement>('#card-preview'),
  basketTemplate: ensureElement<HTMLTemplateElement>('#basket'),
  cardBasketTemplate: ensureElement<HTMLTemplateElement>('#card-basket'),
  orderPaymentsTemplate: ensureElement<HTMLTemplateElement>('#order'),
  orderContactsTemplate: ensureElement<HTMLTemplateElement>('#contacts'),
  successTemplate: ensureElement<HTMLTemplateElement>('#success'),
};

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(templates.basketTemplate), events);
const orderPayments = new OrderPayments(cloneTemplate(templates.orderPaymentsTemplate), events);
const orderContacts = new OrderContacts(cloneTemplate(templates.orderContactsTemplate), events);

// Обработчики событий

// Изменение элементов каталога
events.on<CatalogChangeEvent>('cards:changed', () => {
  page.catalog = appData.catalog.map((item) => {
    const card = new Card(cloneTemplate(templates.cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item),
    });
    return card.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
});

// Отправить в превью карточку
events.on('card:select', (item: ICardItem) => {
  appData.setPreview(item);
});

// Открылось превью карточки товара
events.on('preview:changed', (item: ICardItem) => {
  const card = new Card(cloneTemplate(templates.cardPreviewTemplate), {
    onClick: () => {
      events.emit('card:toBasket', item);
      events.emit('preview:changed', item);
    },
  });
  modal.render({
    content: card.render({
      title: item.title,
      image: item.image,
      description: item.description,
      price: item.price,
      category: item.category,
      buttonName: appData.setButtonText(item),
    }),
  });
});

// Изменились товары в корзине
events.on('basket:changed', () => {
  page.counter = appData.getCardsInBasket().length;
  basket.items = appData.getCardsInBasket().map((item) => {
    const basketItem = new BasketItem(cloneTemplate(templates.cardBasketTemplate), {
      onClick: () => events.emit('card:fromBasket', item),
    });
    basketItem.index = appData.getBasketItemIndex(item);
    return basketItem.render({
      title: item.title,
      price: item.price,
    });
  });
  basket.total = appData.getTotal();
});

// Добавить в корзину
events.on('card:toBasket', (item: ICardItem) => {
  appData.toggleCardInBasket(item);
});

// Удалить из корзины
events.on('card:fromBasket', (item: ICardItem) => {
  appData.deleteCardFromBasket(item);
});

// Открыть корзину
events.on('basket:open', () => {
  modal.render({
    content: basket.render(),
  });
});

// Открыть форму заказа
events.on('order:open', () => {
  orderPayments.cancelPayment();
  modal.render({
    content: orderPayments.render({
      address: '',
      valid: false,
      errors: [],
    }),
  });
});

// Переключение вида оплаты товара
events.on('order:change payment', (data: { payment: string; button: HTMLElement }) => {
  appData.setOrderPayment(data.payment);
  orderPayments.togglePayment(data.button);
  appData.validateOrder();
});

// Открытие формы контактов заказа
events.on('order:submit', () => {
  modal.render({
    content: orderContacts.render({
      email: '',
      phone: '',
      valid: false,
      errors: [],
    }),
  });
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
  appData.sendCardsInOrder();
  api.orderProducts(appData.order)
    .then((result) => {
      const success = new Success(cloneTemplate(templates.successTemplate), {
        onClick: () => {
          modal.close();
        },
      });
      modal.render({
        content: success.render({
          total: result.total,
        }),
      });
      appData.clearBasket();
    })
    .catch((err) => {
      console.error('Ошибка при отправке заказа:', err);
    });
});

// Изменилось одно из полей input
events.on(/^order\..*:change/, (data: { field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>; value: string; }) => {
  appData.setOrderField(data.field, data.value);
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
  const { address, payment, phone, email } = errors;
  orderPayments.valid = !payment && !address;
  orderPayments.errors = Object.values({ payment, address }).filter(Boolean).join('; ');
  orderContacts.valid = !phone && !email;
  orderContacts.errors = Object.values({ phone, email }).filter(Boolean).join('; ');
});

// Изменение состояния модалки
events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

// Получение списка карточек
api.getCardList()
  .then(appData.setCatalog.bind(appData))
  .catch((err) => {
    console.error('Ошибка при загрузке каталога:', err);
  });
