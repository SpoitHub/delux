# CI/CD Setup Guide

Этот документ описывает настройку GitHub Actions CI/CD пайплайна для проекта Delux.

## 📋 Что делает пайплайн

1. **Backend Testing** - Запускает Django тесты на Python 3.11 с PostgreSQL
2. **Frontend Testing** - Проверяет код через ESLint и собирает проект
3. **Code Quality** - Проверяет качество кода (Black, Flake8)
4. **Docker Build & Push** - Собирает Docker образы и загружает их в Docker Hub

## 🔐 Необходимые Secrets в GitHub

Перейди в GitHub → Settings → Secrets → Actions и добавь следующие переменные:

### Обязательные
```
DOCKER_HUB_USERNAME - твой username на Docker Hub
DOCKER_HUB_PASSWORD - твой Personal Access Token на Docker Hub
```

### Как получить Docker Hub Token
1. Перейди на https://hub.docker.com/settings/security
2. Нажми "New Access Token"
3. Установи permissions: Read & Write
4. Скопируй токен в GitHub Secrets

## 📌 Когда запускается пайплайн

- ✅ На каждый push в ветки `main` и `develop`
- ✅ На каждый Pull Request в эти ветки
- ✅ Сборка Docker образов происходит ТОЛЬКО на прямых push'ах в main/develop

## 🏗️ Что нужно добавить в backend

### 1. conftest.py для pytest

Создай файл `backend/conftest.py`:

```python
import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

def pytest.configure():
    django.setup()
```

### 2. Базовый тест

Создай тестовый файл `backend/tests.py`:

```python
import pytest
from django.test import TestCase

@pytest.mark.django_db
def test_database_connection():
    """Test that database connection works"""
    assert True

class BasicTests(TestCase):
    def test_basic(self):
        """Basic test"""
        self.assertEqual(1, 1)
```

### 3. Зависимости для тестирования

Добавь в `backend/requirements.txt`:

```
pytest==7.4.3
pytest-django==4.5.2
pytest-cov==4.1.0
```

## 🎨 Frontend тестирование

Frontend использует существующий `pnpm lint` и `pnpm build`.

Если хочешь добавить unit-тесты, установи Vitest:

```bash
cd frontend
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

И добавь скрипт в `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

## 📝 Пример GitHub Actions Flow

```
push на main/develop
    ↓
Запуск тестов (параллельно):
    ├─ Backend: pytest
    ├─ Frontend: lint + build
    └─ Code Quality: black + flake8
    ↓
Если все успешно:
    ├─ Build backend Docker image
    ├─ Build frontend Docker image
    └─ Push to Docker Hub
```

## 🚀 Локальная смулюция CI

Чтобы быстро проверить, что покажет CI:

### Backend
```bash
cd backend
pip install -r requirements.txt pytest pytest-django pytest-cov
python manage.py migrate --noinput
pytest --cov=. --cov-report=term-missing
```

### Frontend
```bash
cd frontend
pnpm install
pnpm lint
pnpm build
```

### Docker
```bash
# Backend
docker build -t delux-backend:test ./backend
docker run delux-backend:test

# Frontend
docker build -t delux-frontend:test ./frontend
docker run -p 3000:80 delux-frontend:test
```

## 📊 Мониторинг

- Все запуски можно видеть в GitHub → Actions
- На каждый состояние будет бейдж статуса
- В Pull Request'ах будут отображаться результаты тестов

## 🔧 Кастомизация

### Изменить Python версию
В `.github/workflows/ci-cd.yml` найди:
```yaml
python-version: '3.11'
```
И измени на нужную.

### Изменить Node версию
```yaml
node-version: '18'
```

### Добавить дополнительные ветки
```yaml
on:
  push:
    branches: [ main, develop, staging ]
```

### Отключить автоматическую сборку Docker
Удали или закомментируй шаг `build-and-push` из workflow.

## ❓ Troubleshooting

### Tests фейлят локально, но должны пройти в CI
- Убедись, что у тебя правильные env переменные
- Проверь версии в requirements.txt

### Docker push фейлит
- Проверь что правильно установлены DOCKER_HUB_USERNAME и DOCKER_HUB_PASSWORD в Secrets
- Убедись что username совпадает с логином от Docker Hub

### Frontend build фейлит
- Проверь что все зависимости в package.json
- Локально запусти `pnpm build`

## 📚 Полезные ссылки

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Build Action](https://github.com/docker/build-push-action)
- [pytest Documentation](https://docs.pytest.org/)
- [ESLint Configuration](https://eslint.org/docs/user-guide/configure)
