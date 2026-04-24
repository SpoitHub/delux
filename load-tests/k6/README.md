# k6 Load Testing

Этот набор сценариев проверяет API под нагрузкой по трем направлениям:
- `public_browse`: публичные страницы (`/events`, `/products`, детали).
- `auth_login`: поток логинов (`/auth/login`).
- `checkout_flow`: пользовательский путь `register -> login -> cart -> order -> payment`.

## Файл сценария

- `api-load.js`

## Быстрый запуск

1. Поднимите backend и БД (например, через `docker compose up -d backend db`).
2. Убедитесь, что есть хотя бы один активный продукт и один опубликованный ивент.
3. Запустите нагрузку:

```bash
k6 run load-tests/k6/api-load.js
```

Если `k6` не установлен локально:

```bash
docker run --rm -i --network host -v "$PWD:/work" -w /work grafana/k6 run load-tests/k6/api-load.js
```

## Настройки через ENV

Базовые:
- `BASE_URL` (default: `http://localhost:8000`)
- `API_PREFIX` (default: `/api/v1`)
- `K6_LOGIN_EMAIL` (default: `k6.login@example.com`)
- `K6_USER_PASSWORD` (default: `k6-test-pass-123`)

Профиль нагрузки:
- `BROWSE_TARGET_VUS` (default: `100`)
- `BROWSE_RAMP_UP` (default: `2m`)
- `BROWSE_HOLD` (default: `3m`)
- `BROWSE_RAMP_DOWN` (default: `1m`)
- `LOGIN_RPS` (default: `20`)
- `LOGIN_DURATION` (default: `4m`)
- `CHECKOUT_START_RATE` (default: `1`)
- `CHECKOUT_PEAK_RATE` (default: `6`)
- `CHECKOUT_RAMP_UP` (default: `2m`)
- `CHECKOUT_HOLD` (default: `3m`)
- `CHECKOUT_RAMP_DOWN` (default: `1m`)

Пример:

```bash
BASE_URL=http://localhost:8000 LOGIN_RPS=40 BROWSE_TARGET_VUS=150 k6 run load-tests/k6/api-load.js
```

## Метрики и пороги

Скрипт валит прогон, если:
- `http_req_failed >= 5%`
- `http_req_duration p(95) >= 1000ms`
- `checks <= 95%`
- `checkout_flow_duration_ms p(95) >= 3000ms`

Дополнительно пишет кастомные метрики:
- `endpoint_latency_ms`
- `checkout_flow_duration_ms`
- `checkout_success_total`
- `checkout_skipped_total`
