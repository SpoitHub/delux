# 🏅 SpoitHub

**Единая платформа для спортивных ивентов и маркетплейс экипировки**

![Python](https://img.shields.io/badge/Python-3.11%2B-blue?style=for-the-badge&logo=python)
![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql)

[Описание](#-о-проекте) • [Архитектура](#%EF%B8%8F-архитектура) • [Запуск](#-установка-и-запуск) • [Сценарии](#-user-flows)

</div>

---

## 🚀 О проекте

**SpoitHub** — это комплексное SaaS-решение, объединяющее **Event Ticketing** (регистрацию на события) и **E-commerce** (продажу товаров).

Обычный путь спортсмена: зарегистрироваться на марафон на одном сайте, купить гели и экипировку на другом.
**Решение SpoitHub:** Единый флоу — *"Нашёл старт → Зарегистрировался → Добавил мерч в корзину → Получил QR-код → Побежал"*.

### Основные возможности
*   🗓 **Events:** Каталог событий с фильтрацией (Full-Text Search), разные типы билетов (Early Bird, VIP), лимиты слотов.
*   🛒 **Marketplace:** Полноценный магазин внутри платформы. Товары, привязанные к конкретным ивентам (мерч) или общие категории.
*   👤 **Кабинет:** "Мои билеты" с QR-кодами, история заказов, профиль спортсмена.
*   🔐 **Ролевая модель:** Организатор (управление своим ивентом), Участник, Администратор платформы.

---

## 🏗️ Архитектура

Проект построен как **Monolithic Application** на базе Django с использованием Server-Side Rendering (Templates). Стилизация реализована через Tailwind CSS с JIT-компиляцией.

```mermaid
graph TD
    Client[Browser / Client] -->|HTTP Request| Nginx[Web Server / Gateway]
    Nginx -->|Proxy| Gunicorn[Gunicorn WSGI]
    Gunicorn -->|Execute| Django[Django Core]
    
    subgraph "Backend Logic"
        Django -->|Auth & Perms| Auth[Authentication]
        Django -->|Query| ORM[Django ORM]
        Django -->|Render| TPL[Templates + Tailwind]
    end
    
    ORM -->|Read/Write| DB[(PostgreSQL)]
    DB -->|Full-Text Search| Search[SearchVector]
    
    Django -.->|Store Assets| Media[Media Files]
```

---

## Технический стек
*  Backend: Django 5.x (Class-Based Views, ORM, Signals, Sessions).
*  Frontend: Django Templates + Tailwind CSS (via django-tailwind).
*  Database: PostgreSQL (используется SearchVector для поиска по событиям и товарам).
*  DevOps: Docker, Docker Compose (опционально).

---

## 🔄 User Flows
Логика работы пользователя (Участника) на платформе:
```mermaid
graph TD
    Start([Start: User Lands on Site]) --> Search[Search & Filter Events]
    Search -->|Select Event| EventPage[Event Details Page]
    
    subgraph "Shopping Process"
        EventPage -->|Select Ticket| Cart[Shopping Cart]
        EventPage -->|Add Merch| Cart
    end
    
    Cart --> Checkout{Is Logged In?}
    
    Checkout -->|No| Auth[Login / Register]
    Auth --> Checkout
    
    Checkout -->|Yes| Payment[Confirm Order]
    
    Payment -->|Processing| DB[(Database)]
    DB --> Success([Success Page & QR Code])

```

---

## 🛠 Установка и запуск
Для разработки требуется Python 3.10+ и Node.js (для сборки Tailwind).

1. Клонирование и настройка:

```
git clone https://github.com/your-username/spoithub.git
cd spoithub

# Создаем виртуальное окружение
python -m venv venv

# Активируем (Windows)
venv\Scripts\activate
# Активируем (Mac/Linux)
source venv/bin/activate
```

2. Установка зависимостей:

```
# Python пакеты
pip install -r requirements.txt

# Инициализация Tailwind (установит JS-библиотеки)
python manage.py tailwind install
```

3. Переменные окружения (.env)
Создайте файл .env в корне проекта:

```
DEBUG=True
SECRET_KEY=dev-secret-key-123
DATABASE_URL=postgres://postgres:password@localhost:5432/spoithub_db
# Если нет PostgreSQL, удалите DATABASE_URL для использования SQLite
```

4. База данных:

```
python manage.py migrate
python manage.py createsuperuser

```

5. Запуск серверов ⚡️
Вам потребуется два терминала для разработки:

Терминал 1 (Django Server):

```
python manage.py runserver
```

Терминал 2 (Tailwind Watcher - автосборка стилей):

```
python manage.py tailwind start
```

Сайт доступен по адресу: http://127.0.0.1:8000

---

## 🗺 Roadmap (План развития)
| Этап     | Статус | Задачи                                                  |
| -------- | ------ | ------------------------------------------------------- |
| MVP Core | 🟡     | Настройка стека, Модели данных (Events, Users), Админка |
| Events   | 🔴     | Каталог, Детальная страница, Поиск, Регистрация         |
| Commerce | 🔴     | Корзина (Sessions), Оформление заказа, Модели товаров   |
| Release  | ⚪      | Личный кабинет, QR-коды, Email-уведомления              |

---

## 📂 Структура проекта
```
spoithub/
├── manage.py
├── spoithub/          # Project Settings
├── theme/             # Tailwind CSS app
├── apps/
│   ├── core/          # Общие миксины и утилиты
│   ├── users/         # Custom User, Profile, Auth views
│   ├── events/        # Event, TicketType, Registration
│   └── store/         # Product, Order, Cart
├── templates/         # HTML шаблоны
└── static/            # Скомпилированные стили
```
