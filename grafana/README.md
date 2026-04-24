# Grafana Setup для Delux

## Описание
Grafana развёрнута в отдельной папке и интегрирована в общую Docker конфигурацию вместе с Prometheus для мониторинга приложения.

## Структура
```
grafana/
├── provisioning/
│   ├── dashboards/
│   │   ├── dashboards.yml          # Конфигурация dashboards provider
│   │   └── delux-dashboard.json    # Пример dashboard
│   └── datasources/
│       └── datasources.yml         # Конфигурация datasources (PostgreSQL, Prometheus)
├── grafana.ini                     # Основная конфигурация Grafana
└── .env                            # Переменные окружения

prometheus/
└── prometheus.yml                  # Конфигурация Prometheus для сбора метрик
```

## Как использовать

### 1. Запуск через Docker Compose
```bash
docker-compose up -d
```

Это запустит:
- **Backend** на http://localhost:8000
- **Frontend** на http://localhost:5174
- **Prometheus** на http://localhost:9090
- **Grafana** на http://localhost:3000
- **PostgreSQL** на localhost:5434

### 2. Доступ к Grafana
- URL: http://localhost:3000
- Логин: `admin`
- Пароль: `admin`

### 3. Доступные Datasources
- **PostgreSQL** - для запросов к базе данных
- **Prometheus** - для метрик приложения (установлена по умолчанию)

### 4. Добавление собственных Dashboards
1. Зайдите в Grafana
2. Откройте меню и выберите Dashboards → New
3. Создайте dashboard
4. Сохраните dashboard как JSON в папку `grafana/provisioning/dashboards/`
5. Изменённые dashboard автоматически загрузятся

## Конфигурация

### Важные переменные в `grafana/.env`
- `GF_SECURITY_ADMIN_USER` - логин администратора
- `GF_SECURITY_ADMIN_PASSWORD` - пароль администратора
- `GF_SERVER_HTTP_PORT` - порт Grafana
- `GF_USERS_ALLOW_SIGN_UP` - разрешить регистрацию пользователей

### Prometheus Scrape Targets
В `prometheus/prometheus.yml` настроены targets для:
- Backend приложения (http://backend:8000/metrics)
- Самого Prometheus
- PostgreSQL (при наличии экспортера)

## Для продвинутой настройки

Если нужны метрики от Django backend, установите:
```bash
pip install django-prometheus
```

И добавьте в `backend/config/settings.py`:
```python
INSTALLED_APPS = [
    ...
    'django_prometheus',
]

MIDDLEWARE = [
    'django_prometheus.middleware.PrometheusBeforeMiddleware',
    ...
    'django_prometheus.middleware.PrometheusAfterMiddleware',
]
```

Затем добавьте в `backend/config/urls.py`:
```python
from django_prometheus import views as prometheus_views

urlpatterns = [
    ...
    path('metrics', prometheus_views.metrics),
]
```

## Остановка
```bash
docker-compose down
```

Для удаления всех данных мониторинга:
```bash
docker-compose down -v
```
