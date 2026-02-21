Конечно! Я перевел всё ТЗ в чистый, отлично читаемый Markdown-формат. Добавил подсветку синтаксиса для JSON, файловой структуры и выделил API-запросы для удобства работы.

Скопируй код ниже и вставь его в свой файл (например, `FRONTEND_SPEC.md` или `README.md`):

```markdown
# Delux MVP — Frontend Specification (React)

This document describes what the Frontend developer must implement for the Delux MVP. Backend is implemented separately (Django + DRF). Frontend must integrate with the API via HTTP requests.

## 1) Tech stack & conventions

* **Core:** React + Vite + TypeScript (preferred) + Tailwind CSS
* **Routing:** `react-router-dom`
* **API client:** Axios (with interceptors) OR Fetch wrapper
* **Data fetching/caching:** React Query (TanStack Query) *(recommended)*
* **State for auth/cart UI:** Zustand or Context (lightweight)
* **Form validation:** `zod` + `react-hook-form` *(recommended)*
* **Dates:** `dayjs`
* **Currency:** KZT formatting (`Intl.NumberFormat`)
* **UI:** Tailwind components (cards, modals, tables, toasts)
* **Errors:** global toast + inline field errors
* **Environment:** `VITE_API_BASE_URL` in `.env` (e.g., `http://localhost:8000/api/v1`)

## 2) Frontend project structure

Recommended folder layout (feature-based):

```text
frontend/
  src/
    app/                 # providers, router, layouts
    pages/               # route pages
    features/            # auth, cart, checkout, organizer, crm
    entities/            # Event, Product, Order types + UI blocks
    shared/
      api/               # axios client + endpoints
      ui/                # buttons, inputs, modals, tables
      lib/               # utils, formatters
      config/            # env, constants
```

## 3) Pages & routes (must-have)

### Public
* `/` — **HomePage** — highlights: upcoming events + featured products
* `/events` — **EventsListPage** — list + filters
* `/events/:id` — **EventDetailsPage** — details + ticket purchase
* `/shop` — **ProductsListPage** — list + filters
* `/products/:id` — **ProductDetailsPage** — details + add to cart
* `/cart` — **CartPage** — items, quantities, remove
* `/checkout` — **CheckoutPage** — create order, choose delivery_type
* `/payment/:orderId` — **PaymentPage** — mock pay button + status
* `/orders/:id` — **OrderDetailsPage** — summary + status
* `/login` — **LoginPage**
* `/register` — **RegisterPage**

### Organizer / CRM (protected)
* `/crm` — **CrmDashboardPage** — stats
* `/crm/events` — **CrmEventsPage** — manage events
* `/crm/events/new` — **CrmEventCreatePage**
* `/crm/events/:id/edit` — **CrmEventEditPage**
* `/crm/products` — **CrmProductsPage** — manage products
* `/crm/products/new` — **CrmProductCreatePage**
* `/crm/products/:id/edit` — **CrmProductEditPage**
* `/crm/orders` — **CrmOrdersPage** — list + filters
* `/crm/orders/:id` — **CrmOrderDetailsPage** — status actions
* `/crm/customers` — **CrmCustomersPage** — list + notes

## 4) Layout & UI components (minimum)

* **MainLayout:** header with navigation (Events, Shop, Cart), login/profile button
* **OrganizerLayout (CRM):** left sidebar menu + top bar
* **Shared components:** Button, Input, Select, Badge, Modal, Table, Pagination, Toast
* **Loading states:** skeletons/spinners for lists and forms
* **Empty states:** "No events found", "Cart is empty", etc.

## 5) Authentication flow

Frontend must implement:
* Register, Login forms
* Store JWT tokens *(preferred: httpOnly cookies; acceptable for MVP: localStorage)*
* Axios interceptor to attach `Authorization: Bearer <access>`
* Refresh token logic (if backend supports refresh endpoint)
* Protected routes: `/crm/*` requires organizer role (`OrganizerProfile` exists)

### Auth API calls
Assumed endpoints (backend will provide exact):
* **`POST`** `/auth/register/` — body: `{email, password, first_name?, last_name?}`
* **`POST`** `/auth/login/` — body: `{email, password}` → returns `{access, refresh, user}`
* **`POST`** `/auth/logout/` — body: `{}` (optional)
* **`POST`** `/auth/token/refresh/` — body: `{refresh}` → returns `{access}`
* **`GET`**  `/auth/me/` — headers: `Authorization` → returns current user + organizer flag/profile
* **`POST`** `/auth/organizer/` — create organizer profile (protected)

### Frontend pages required for Auth
* `/register` — submit register; on success redirect to `/login` or auto-login
* `/login` — submit login; on success redirect to previous page or `/`
* **Organizer enable:** button in profile menu: "Become organizer" → calls `POST /auth/organizer/`

## 6) Events module (UI + API calls)

### EventsListPage (`/events`)
**UI:** cards list, search, filters (format: online/offline; price: free/paid; city (optional), date range optional).
**API calls:**
* **`GET`** `/events/` (query params optional)
  * Examples:
    * `GET /events/?search=boxing`
    * `GET /events/?format=offline&is_free=false`
    * `GET /events/?city=Almaty&date_from=2026-02-01&date_to=2026-02-28`
*(No body, only query params).*

### EventDetailsPage (`/events/:id`)
**UI:** title, description, schedule, location OR online link (if allowed), ticket types, buy button.
**API calls:**
* **`GET`** `/events/{id}/` — no body
* **`GET`** `/events/{id}/tickets/` — no body (or included in event details)

**Buy ticket flow (MVP):**
* **Option A (recommended unified cart):** add ticket to cart
  * **`POST`** `/cart/items/` — body: `{item_type: 'ticket', ticket_type_id, quantity}`
* **Option B (direct order):**
  * **`POST`** `/orders/` — body includes ticket item (see Orders section).

## 7) Marketplace module (UI + API calls)

### ProductsListPage (`/shop`)
**UI:** grid list, search, category filter, price range.
**API calls:**
* **`GET`** `/products/` — query params optional, no body
  * Examples: `GET /products/?search=ball` ; `GET /products/?category=shoes&min_price=10000&max_price=50000`

### ProductDetailsPage (`/products/:id`)
**UI:** images, title, price, stock, add to cart.
**API calls:**
* **`GET`** `/products/{id}/` — no body
* **`POST`** `/cart/items/` — body: `{item_type: 'product', product_id, quantity}`

## 8) Cart & Orders (UI + API calls)

### CartPage (`/cart`)
**UI:** list of CartItems (products + tickets), qty controls, remove item, subtotal.
**API calls:**
* **`GET`** `/cart/` — no body
* **`PATCH`** `/cart/items/{id}/` — body: `{quantity}`
* **`DELETE`** `/cart/items/{id}/` — no body
* **`POST`** `/cart/clear/` — no body (optional)

### CheckoutPage (`/checkout`)
**UI:** customer contact fields, delivery_type (none/pickup/delivery). If delivery: address fields.
**API call (create order):**
* **`POST`** `/orders/` — body example:
```json
{
  "delivery_type": "delivery",
  "contact": { "name": "Bekzat", "phone": "+7..." },
  "shipping_address": { "city": "Almaty", "address_line": "...", "postal_code": "" }
}
```
*Backend will take current cart and create Order + OrderItems. No need to send items again (recommended). On success redirect to `/payment/{orderId}` or `/orders/{orderId}`.*

### OrderDetailsPage (`/orders/:id`)
**UI:** order header (status, total), items list, address, payment status.
**API call:**
* **`GET`** `/orders/{id}/` — no body

## 9) Payments (UI + API calls)

### PaymentPage (`/payment/:orderId`)
MVP uses MOCK payment:
* **`GET`** `/orders/{id}/` — load summary
* **`POST`** `/payments/mock/charge/` — body: `{order_id}` OR `{}` if in URL; backend decides.
*After success: redirect to `/orders/{id}` and show status paid. If failure: show error and allow retry.*

## 10) CRM (Organizer area) — UI + API calls

*All `/crm` routes are protected: require logged-in user with OrganizerProfile.*

### CrmDashboardPage (`/crm`)
**UI:** stats cards (events count, orders count, revenue), charts optional.
**API call:**
* **`GET`** `/crm/dashboard/` — no body

### CrmEventsPage (`/crm/events`)
**UI:** table list, status badge, actions: edit/publish/unpublish.
**API calls:**
* **`GET`** `/crm/events/` — no body
* **`POST`** `/crm/events/` — create event (body includes event fields)
* **`PATCH`** `/crm/events/{id}/` — update event fields
* **`POST`** `/crm/events/{id}/publish/` — no body (or `{status: 'published'}`)

### CrmEventCreate / Edit
Body example for create/update:
```json
{
  "title": "Street Workout Battle",
  "description": "...",
  "format": "offline",
  "start_datetime": "2026-03-10T12:00:00",
  "end_datetime": "2026-03-10T18:00:00",
  "is_free": false,
  "location": { "city": "Almaty", "address": "..." },
  "ticket_types": [
    { "name": "Standard", "price": 5000, "quantity_total": 100 },
    { "name": "VIP", "price": 15000, "quantity_total": 20 }
  ]
}
```
*Frontend can send location/online_info and ticket_types in one request if backend supports it; otherwise separate endpoints.*

### CrmProductsPage (`/crm/products`)
**UI:** table list, create/edit, stock editing.
**API calls:**
* **`GET`** `/crm/products/` — no body
* **`POST`** `/crm/products/` — body includes product fields
* **`PATCH`** `/crm/products/{id}/` — update
* **`POST`** `/crm/products/{id}/images/` — multipart upload (optional for MVP)

Body example:
```json
{
  "title": "Boxing gloves",
  "description": "...",
  "price": 25000,
  "category_id": 3,
  "stock_quantity": 12,
  "is_active": true
}
```

### CrmOrdersPage (`/crm/orders`)
**UI:** table list with filters (date_from/date_to, status, payment_status).
**API call:**
* **`GET`** `/crm/orders/?status=paid&date_from=2026-02-01` — no body
**Order actions (optional MVP):**
* **`PATCH`** `/crm/orders/{id}/` — body: `{status: 'shipped'}` or `{status: 'canceled'}`

### CrmOrderDetailsPage (`/crm/orders/:id`)
**UI:** items, customer, address, payment, action buttons.
**API calls:**
* **`GET`** `/crm/orders/{id}/` — no body
* **`POST`** `/crm/orders/{id}/refund/` — body: `{amount}` (optional MVP)

### CrmCustomersPage (`/crm/customers`)
**UI:** list of customers who purchased from organizer; view history and add notes.
**API calls:**
* **`GET`** `/crm/customers/` — no body
* **`GET`** `/crm/customers/{userId}/` — no body (history)
* **`POST`** `/crm/customers/{userId}/notes/` — body: `{note_text}`

## 11) Shared TypeScript types (minimum)

Frontend should define shared types aligned with backend responses:
* `User`, `OrganizerProfile`
* `Event`, `TicketType`
* `Category`, `Product`, `ProductImage`
* `Cart`, `CartItem`
* `Order`, `OrderItem`, `ShippingAddress`
* `Payment`

## 12) Definition of Done (Frontend)

- [ ] All listed pages exist and are reachable via routes
- [ ] All forms validate input and show errors
- [ ] API calls implemented as described (GET without body, POST/PATCH with JSON body)
- [ ] Protected CRM routes redirect to `/login` if not authenticated
- [ ] Organizer-only routes blocked for non-organizers
- [ ] Cart works for both product and ticket items
- [ ] Checkout creates order and payment mock updates order status
- [ ] Basic responsive UI (mobile/tablet/desktop)
```