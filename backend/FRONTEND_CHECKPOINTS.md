# Delux MVP — Backend API Specification

> Base URL: `http://localhost:8000/api/v1`
> Auth: JWT Bearer token — `Authorization: Bearer <access>`
> Format: JSON (`Content-Type: application/json`)

---

## Django Project Structure

```
backend/
  config/               # settings, urls, wsgi, asgi
  auth_app/             # User, OrganizerProfile, JWT
  events_app/           # Event, EventLocation, OnlineInfo, TicketType
  products_app/         # Category, Product, ProductImage
  cart_app/             # Cart, CartItem
  orders_app/           # Order, OrderItem, ShippingAddress, OrderContact
  payments_app/         # Payment, mock charge
  crm_app/              # Dashboard stats, CustomerNote
```

`config/urls.py` includes all apps under `/api/v1/`:
```python
urlpatterns = [
    path("api/v1/auth/",      include("auth_app.urls")),
    path("api/v1/events/",    include("events_app.urls")),
    path("api/v1/products/",  include("products_app.urls")),
    path("api/v1/cart/",      include("cart_app.urls")),
    path("api/v1/orders/",    include("orders_app.urls")),
    path("api/v1/payments/",  include("payments_app.urls")),
    path("api/v1/crm/",       include("crm_app.urls")),
]
```

---

## App 1 — `auth_app`

### Models
```
User (extends AbstractUser)
  - email         EmailField UNIQUE
  - first_name    CharField
  - last_name     CharField
  - is_organizer  BooleanField default=False
  USERNAME_FIELD = "email"

OrganizerProfile
  - user          OneToOne → User
  - company_name  CharField blank=True
  - description   TextField blank=True
  - created_at    auto
```

### Endpoints

---

#### `POST /auth/register/`
Регистрация нового пользователя.

**Auth:** не нужна

**Request:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123",
  "first_name": "Bekzat",
  "last_name": "Akhmet"
}
```

**Response `201`:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "Bekzat",
  "last_name": "Akhmet",
  "is_organizer": false
}
```

**Errors:**
- `400` — email уже занят / невалидный пароль

---

#### `POST /auth/login/`
Вход, возвращает JWT токены.

**Auth:** не нужна

**Request:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123"
}
```

**Response `200`:**
```json
{
  "access": "<jwt_access_token>",
  "refresh": "<jwt_refresh_token>",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "Bekzat",
    "last_name": "Akhmet",
    "is_organizer": false
  }
}
```

**Errors:**
- `401` — неверные credentials

---

#### `POST /auth/token/refresh/`
Обновление access токена.

**Auth:** не нужна

**Request:**
```json
{ "refresh": "<jwt_refresh_token>" }
```

**Response `200`:**
```json
{ "access": "<new_jwt_access_token>" }
```

**Errors:**
- `401` — невалидный или истёкший refresh токен

---

#### `POST /auth/logout/`
Инвалидация refresh токена.

**Auth:** Bearer token

**Request:**
```json
{ "refresh": "<jwt_refresh_token>" }
```

**Response `204`:** пустой body

---

#### `GET /auth/me/`
Получить текущего пользователя + флаг организатора.

**Auth:** Bearer token

**Response `200`:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "Bekzat",
  "last_name": "Akhmet",
  "is_organizer": true,
  "organizer_profile": {
    "id": 1,
    "company_name": "SpoitHub Ltd",
    "description": "Sports events organizer",
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

---

#### `POST /auth/organizer/`
Создать OrganizerProfile (стать организатором).

**Auth:** Bearer token

**Request:**
```json
{
  "company_name": "SpoitHub Ltd",
  "description": "Sports events organizer"
}
```

**Response `201`:**
```json
{
  "id": 1,
  "company_name": "SpoitHub Ltd",
  "description": "Sports events organizer",
  "created_at": "2026-01-01T00:00:00Z"
}
```

**Errors:**
- `400` — профиль уже существует

---

## App 2 — `events_app`

### Models
```
EventLocation
  - city      CharField
  - address   CharField

OnlineInfo
  - url       URLField
  - platform  CharField blank=True

TicketType
  - event           ForeignKey → Event
  - name            CharField
  - price           DecimalField
  - quantity_total  PositiveIntegerField
  - quantity_sold   PositiveIntegerField default=0

Event
  - organizer       ForeignKey → OrganizerProfile
  - title           CharField
  - description     TextField
  - format          CharField choices=[online, offline]
  - start_datetime  DateTimeField
  - end_datetime    DateTimeField
  - is_free         BooleanField default=False
  - status          CharField choices=[draft, published, cancelled, completed]
  - location        OneToOne → EventLocation nullable
  - online_info     OneToOne → OnlineInfo nullable
  - image           ImageField nullable
  - created_at      auto
  - updated_at      auto
```

### Endpoints

---

#### `GET /events/`
Список опубликованных событий с фильтрами.

**Auth:** не нужна

**Query params:**
| Параметр   | Тип    | Пример          |
|------------|--------|-----------------|
| search     | string | `boxing`        |
| format     | string | `online/offline`|
| is_free    | bool   | `true/false`    |
| city       | string | `Almaty`        |
| date_from  | date   | `2026-02-01`    |
| date_to    | date   | `2026-02-28`    |
| page       | int    | `1`             |

**Response `200`:**
```json
{
  "count": 12,
  "next": "http://localhost:8000/api/v1/events/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Urban Marathon 2026",
      "description": "...",
      "format": "offline",
      "start_datetime": "2026-03-15T08:00:00Z",
      "end_datetime": "2026-03-15T16:00:00Z",
      "is_free": false,
      "status": "published",
      "location": { "city": "Almaty", "address": "Central Park" },
      "online_info": null,
      "image": "http://localhost:8000/media/events/1.jpg",
      "organizer": { "id": 1, "company_name": "SpoitHub Ltd" },
      "ticket_types": [
        { "id": 1, "name": "Standard", "price": "5000.00", "quantity_total": 100, "quantity_sold": 45 }
      ],
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

#### `GET /events/{id}/`
Детали одного события.

**Auth:** не нужна

**Response `200`:** тот же объект что и в списке (полный)

**Errors:**
- `404` — событие не найдено или не опубликовано

---

#### `GET /events/{id}/tickets/`
Список типов билетов события.

**Auth:** не нужна

**Response `200`:**
```json
[
  { "id": 1, "name": "Standard", "price": "5000.00", "quantity_total": 100, "quantity_sold": 45 },
  { "id": 2, "name": "VIP",      "price": "15000.00","quantity_total": 20,  "quantity_sold": 10 }
]
```

---

## App 3 — `products_app`

### Models
```
Category
  - name  CharField
  - slug  SlugField UNIQUE

ProductImage
  - product     ForeignKey → Product
  - image       ImageField
  - is_primary  BooleanField default=False

Product
  - title           CharField
  - description     TextField
  - price           DecimalField
  - category        ForeignKey → Category nullable
  - stock_quantity  PositiveIntegerField default=0
  - is_active       BooleanField default=True
  - created_at      auto
  - updated_at      auto
```

### Endpoints

---

#### `GET /products/`
Список активных товаров с фильтрами.

**Auth:** не нужна

**Query params:**
| Параметр  | Тип    | Пример   |
|-----------|--------|----------|
| search    | string | `ball`   |
| category  | string | `shoes`  |
| min_price | number | `10000`  |
| max_price | number | `50000`  |
| page      | int    | `1`      |

**Response `200`:**
```json
{
  "count": 24,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Boxing Gloves Pro",
      "description": "...",
      "price": "25000.00",
      "category": { "id": 3, "name": "Equipment", "slug": "equipment" },
      "stock_quantity": 12,
      "is_active": true,
      "images": [
        { "id": 1, "image": "http://localhost:8000/media/products/1.jpg", "is_primary": true }
      ],
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

#### `GET /products/{id}/`
Детали одного товара.

**Auth:** не нужна

**Response `200`:** полный объект продукта

**Errors:**
- `404` — товар не найден или неактивен

---

#### `GET /products/categories/`
Список всех категорий.

**Auth:** не нужна

**Response `200`:**
```json
[
  { "id": 1, "name": "Apparel",     "slug": "apparel" },
  { "id": 2, "name": "Footwear",    "slug": "footwear" },
  { "id": 3, "name": "Equipment",   "slug": "equipment" },
  { "id": 4, "name": "Accessories", "slug": "accessories" }
]
```

---

## App 4 — `cart_app`

### Models
```
Cart
  - user        OneToOne → User
  - created_at  auto
  - updated_at  auto

CartItem
  - cart          ForeignKey → Cart
  - item_type     CharField choices=[product, ticket]
  - product       ForeignKey → Product nullable
  - ticket_type   ForeignKey → TicketType nullable
  - quantity      PositiveIntegerField
  - unit_price    DecimalField (зафиксировать цену на момент добавления)
```

> Вычисляемые поля: `total_price = unit_price * quantity`, `items_count`, `total` считаются в сериализаторе.

### Endpoints

---

#### `GET /cart/`
Получить корзину текущего пользователя (создаётся автоматически если нет).

**Auth:** Bearer token

**Response `200`:**
```json
{
  "id": 1,
  "items": [
    {
      "id": 10,
      "item_type": "product",
      "product": { "id": 1, "title": "Boxing Gloves Pro", "price": "25000.00", "images": [...] },
      "ticket_type": null,
      "event": null,
      "quantity": 2,
      "unit_price": "25000.00",
      "total_price": "50000.00"
    },
    {
      "id": 11,
      "item_type": "ticket",
      "product": null,
      "ticket_type": { "id": 1, "name": "Standard", "price": "5000.00" },
      "event": { "id": 1, "title": "Urban Marathon 2026", "start_datetime": "..." },
      "quantity": 1,
      "unit_price": "5000.00",
      "total_price": "5000.00"
    }
  ],
  "items_count": 3,
  "total": "55000.00"
}
```

---

#### `POST /cart/items/`
Добавить товар или билет в корзину.

**Auth:** Bearer token

**Request (product):**
```json
{ "item_type": "product", "product_id": 1, "quantity": 2 }
```

**Request (ticket):**
```json
{ "item_type": "ticket", "ticket_type_id": 1, "quantity": 1 }
```

**Response `201`:** объект CartItem (см. выше структуру items[])

**Errors:**
- `400` — недостаточно stock / quantity_total
- `400` — item_type не соответствует переданным полям

---

#### `PATCH /cart/items/{id}/`
Изменить количество.

**Auth:** Bearer token (только свои items)

**Request:**
```json
{ "quantity": 3 }
```

**Response `200`:** обновлённый CartItem

**Errors:**
- `400` — quantity < 1
- `404` — item не найден

---

#### `DELETE /cart/items/{id}/`
Удалить позицию из корзины.

**Auth:** Bearer token (только свои items)

**Response `204`:** пустой body

---

#### `POST /cart/clear/`
Очистить всю корзину.

**Auth:** Bearer token

**Response `204`:** пустой body

---

## App 5 — `orders_app`

### Models
```
ShippingAddress
  - city         CharField
  - address_line CharField
  - postal_code  CharField blank=True

OrderContact
  - name   CharField
  - phone  CharField

OrderItem
  - order         ForeignKey → Order
  - item_type     CharField choices=[product, ticket]
  - product       ForeignKey → Product nullable
  - ticket_type   ForeignKey → TicketType nullable
  - quantity      PositiveIntegerField
  - unit_price    DecimalField
  - total_price   DecimalField

Order
  - user              ForeignKey → User
  - status            CharField choices=[pending, confirmed, processing, shipped, delivered, cancelled]
  - payment_status    CharField choices=[pending, paid, failed, refunded]
  - delivery_type     CharField choices=[none, pickup, delivery]
  - contact           OneToOne → OrderContact
  - shipping_address  OneToOne → ShippingAddress nullable
  - total             DecimalField
  - created_at        auto
  - updated_at        auto
```

### Endpoints

---

#### `POST /orders/`
Создать заказ из текущей корзины.

**Auth:** Bearer token

**Request:**
```json
{
  "delivery_type": "delivery",
  "contact": { "name": "Bekzat", "phone": "+77001234567" },
  "shipping_address": { "city": "Almaty", "address_line": "ул. Абая 10", "postal_code": "050000" }
}
```

> Backend берёт текущую корзину, создаёт OrderItems, обнуляет корзину.

**Response `201`:**
```json
{
  "id": 1001,
  "status": "confirmed",
  "payment_status": "pending",
  "delivery_type": "delivery",
  "contact": { "name": "Bekzat", "phone": "+77001234567" },
  "shipping_address": { "city": "Almaty", "address_line": "ул. Абая 10", "postal_code": "050000" },
  "items": [ ...OrderItem objects... ],
  "total": "55000.00",
  "created_at": "2026-03-03T12:00:00Z",
  "updated_at": "2026-03-03T12:00:00Z"
}
```

**Errors:**
- `400` — корзина пустая
- `400` — delivery_type=delivery, но нет shipping_address

---

#### `GET /orders/{id}/`
Получить детали заказа.

**Auth:** Bearer token (только свои заказы)

**Response `200`:** полный объект Order (см. выше)

**Errors:**
- `404` — заказ не найден или чужой

---

## App 6 — `payments_app`

### Models
```
Payment
  - order           OneToOne → Order
  - amount          DecimalField
  - status          CharField choices=[pending, completed, failed, refunded]
  - payment_method  CharField default="mock_card"
  - created_at      auto
```

### Endpoints

---

#### `POST /payments/mock/charge/`
Mock оплата заказа.

**Auth:** Bearer token

**Request:**
```json
{ "order_id": 1001 }
```

> Backend меняет `Order.payment_status` → `paid`, создаёт `Payment` объект.

**Response `200`:**
```json
{
  "id": 1,
  "order": 1001,
  "amount": "55000.00",
  "status": "completed",
  "payment_method": "mock_card",
  "created_at": "2026-03-03T12:05:00Z"
}
```

**Errors:**
- `400` — заказ уже оплачен
- `404` — заказ не найден или чужой

---

## App 7 — `crm_app`

> Все эндпоинты требуют: `is_authenticated` + `is_organizer = True`

### Models
```
CustomerNote
  - organizer   ForeignKey → OrganizerProfile
  - customer    ForeignKey → User
  - note_text   TextField
  - created_at  auto
```

### Endpoints

---

#### `GET /crm/dashboard/`
Статистика организатора.

**Auth:** Bearer + organizer

**Response `200`:**
```json
{
  "events_count": 5,
  "orders_count": 124,
  "revenue": "1250000.00",
  "customers_count": 87
}
```

---

#### `GET /crm/events/`
Список событий организатора (все статусы).

**Auth:** Bearer + organizer

**Response `200`:** массив Event объектов (те же поля что `/events/`)

---

#### `POST /crm/events/`
Создать новое событие.

**Auth:** Bearer + organizer

**Request:**
```json
{
  "title": "Street Workout Battle",
  "description": "...",
  "format": "offline",
  "start_datetime": "2026-03-10T12:00:00",
  "end_datetime": "2026-03-10T18:00:00",
  "is_free": false,
  "location": { "city": "Almaty", "address": "ул. Достык 5" },
  "ticket_types": [
    { "name": "Standard", "price": 5000, "quantity_total": 100 },
    { "name": "VIP",      "price": 15000, "quantity_total": 20 }
  ]
}
```

**Response `201`:** полный объект Event

---

#### `PATCH /crm/events/{id}/`
Обновить поля события.

**Auth:** Bearer + organizer (только своё событие)

**Request:** любые поля Event (частичный update)
```json
{
  "title": "New Title",
  "ticket_types": [
    { "id": 1, "price": 6000 }
  ]
}
```

**Response `200`:** обновлённый Event

---

#### `POST /crm/events/{id}/publish/`
Опубликовать событие (draft → published).

**Auth:** Bearer + organizer (только своё)

**Response `200`:**
```json
{ "status": "published" }
```

**Errors:**
- `400` — событие уже опубликовано

---

#### `POST /crm/events/{id}/unpublish/`
Снять с публикации (published → draft).

**Auth:** Bearer + organizer (только своё)

**Response `200`:**
```json
{ "status": "draft" }
```

---

#### `GET /crm/products/`
Список товаров организатора.

**Auth:** Bearer + organizer

**Response `200`:** массив Product объектов

---

#### `POST /crm/products/`
Создать товар.

**Auth:** Bearer + organizer

**Request:**
```json
{
  "title": "Boxing Gloves Pro",
  "description": "...",
  "price": 25000,
  "category_id": 3,
  "stock_quantity": 12,
  "is_active": true
}
```

**Response `201`:** полный объект Product

---

#### `PATCH /crm/products/{id}/`
Обновить товар.

**Auth:** Bearer + organizer (только свой)

**Request:** любые поля Product
```json
{ "price": 27000, "stock_quantity": 8 }
```

**Response `200`:** обновлённый Product

---

#### `POST /crm/products/{id}/images/`
Загрузить изображение товара.

**Auth:** Bearer + organizer (только свой)

**Request:** `multipart/form-data`
```
image: <file>
is_primary: true
```

**Response `201`:**
```json
{ "id": 5, "image": "http://localhost:8000/media/products/5.jpg", "is_primary": true }
```

---

#### `GET /crm/orders/`
Список заказов организатора с фильтрами.

**Auth:** Bearer + organizer

**Query params:**
| Параметр       | Тип    | Пример       |
|----------------|--------|--------------|
| status         | string | `shipped`    |
| payment_status | string | `paid`       |
| date_from      | date   | `2026-02-01` |
| date_to        | date   | `2026-02-28` |

**Response `200`:** массив Order объектов (заказы, где есть товары/билеты этого организатора)

---

#### `GET /crm/orders/{id}/`
Детали заказа.

**Auth:** Bearer + organizer (только свои)

**Response `200`:** полный объект Order

---

#### `PATCH /crm/orders/{id}/`
Изменить статус заказа.

**Auth:** Bearer + organizer

**Request:**
```json
{ "status": "shipped" }
```

**Response `200`:** обновлённый Order

---

#### `POST /crm/orders/{id}/refund/`
Вернуть средства (опционально для MVP).

**Auth:** Bearer + organizer

**Request:**
```json
{ "amount": 55000 }
```

**Response `200`:**
```json
{ "status": "refunded", "amount": "55000.00" }
```

---

#### `GET /crm/customers/`
Список покупателей организатора.

**Auth:** Bearer + organizer

**Response `200`:**
```json
[
  {
    "id": 1,
    "email": "buyer@example.com",
    "first_name": "Alex",
    "last_name": "Johnson",
    "orders_count": 5,
    "total_spent": "125000.00",
    "last_order_date": "2026-02-20T10:00:00Z",
    "notes": []
  }
]
```

---

#### `GET /crm/customers/{userId}/`
История заказов одного покупателя.

**Auth:** Bearer + organizer

**Response `200`:**
```json
{
  "id": 1,
  "email": "buyer@example.com",
  "first_name": "Alex",
  "last_name": "Johnson",
  "orders": [ ...Order objects... ],
  "notes": [
    { "id": 1, "note_text": "VIP customer", "created_at": "2026-02-01T00:00:00Z" }
  ]
}
```

---

#### `POST /crm/customers/{userId}/notes/`
Добавить заметку о покупателе.

**Auth:** Bearer + organizer

**Request:**
```json
{ "note_text": "Постоянный клиент, всегда берёт VIP" }
```

**Response `201`:**
```json
{ "id": 2, "note_text": "Постоянный клиент, всегда берёт VIP", "created_at": "2026-03-03T12:00:00Z" }
```

---

## HTTP Status Codes Summary

| Код | Когда используется                          |
|-----|---------------------------------------------|
| 200 | Успешный GET / успешный PATCH               |
| 201 | Успешный POST (создание объекта)            |
| 204 | Успешный DELETE / logout                    |
| 400 | Невалидные данные / бизнес-ошибка           |
| 401 | Не авторизован (нет токена или истёк)       |
| 403 | Нет доступа (не организатор / чужой объект) |
| 404 | Объект не найден                            |

---

## Implementation Order (этапы)

- [x] **Этап 1** — `auth_app`: User, OrganizerProfile, JWT register/login/me
- [ ] **Этап 2** — `events_app`: Event, TicketType, list/detail endpoints
- [ ] **Этап 3** — `products_app`: Category, Product, ProductImage, list/detail
- [ ] **Этап 4** — `cart_app`: Cart, CartItem, GET/POST/PATCH/DELETE/clear
- [ ] **Этап 5** — `orders_app`: Order, OrderItem, create/detail
- [ ] **Этап 6** — `payments_app`: Payment, mock/charge
- [ ] **Этап 7** — `crm_app`: dashboard, events CRUD, products CRUD, orders, customers+notes