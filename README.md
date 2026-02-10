# Student Skill Hub — MVP

## Краткое описание

**Student Skill Hub** — это web-платформа (marketplace) для соединения студентов-фрилансеров с работодателями. Основная идея: работодатель размещает задачу, специалист подаёт заявку, платёж хранится в безопасном эскроу до завершения работы.

Проект включает:
- Регистрацию и аутентификацию через JWT
- Создание, поиск и фильтрацию задач
- Систему заявок и отклики на задачи
- Безопасный платёжный эскроу (mock-реализация)
- Систему отзывов и рейтинга специалистов
- Real-time чат между участниками (WebSocket)
- Профили с резюме фрилансеров

## Технологический стек

### Backend
- **Python 3.11+** с **Django 4.x** и **Django REST Framework**
- **PostgreSQL** (продакшн) / **SQLite** (локальная разработка)
- **Django Channels 4.x** для WebSocket-чата (в памяти для разработки, Redis в продакшене)
- **JWT токены** (djangorestframework-simplejwt) для аутентификации
- **CORS** поддержка (django-cors-headers) для фронтенда
- **drf-spectacular** для автоматической документации API (Swagger)

### Frontend
- **React 19+** с **TypeScript**
- **Vite 7+** как сборщик (быстро, модно, удобно)
- **React Router 7+** для навигации
- **Axios** для HTTP запросов
- **Tailwind CSS 3+** для стилизации
- **ESLint + TypeScript** для качества кода

### DevOps
- **Docker + Docker Compose** для контейнеризации
- **Nginx** как reverse proxy
- Скрипты для упрощения команд

## Основные функции

### Для работодателей
- Размещение задач с описанием, ценой, сроком, городом и требуемыми навыками
- Просмотр откликов специалистов на задачу
- Управление платежём через эскроу (безопасно)
- Система отзывов о качестве работы
- Real-time чат с исполнителем

### Для специалистов
- Просмотр доступных задач с фильтрацией и поиском
- Подача заявок на интересующие задачи
- Создание и обновление резюме (навыки, опыт, контакты)
- Получение отзывов и построение рейтинга
- Общение с заказчиком через чат

### Для платформы
- Система отзывов (5-звёздочная) для обеих сторон
- Модерирование контента (базовое: админ-панель Django)
- Статистика (через админ-панель)

## Быстрый старт (локально, SQLite)

### Требования
- **Python 3.11+**
- **Node.js 18+** + npm
- **git** (для хранилища)

### Backend

```powershell
# 1. Клонируйте/откройте проект
cd Student-Skill-Hub Django+React

# 2. Создайте виртуальное окружение
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# 3. Установите зависимости
pip install -r backend/requirements.txt

# 4. Примените миграции (используем SQLite)
$env:USE_SQLITE = "1"
python backend/manage.py migrate

# 5. (Опционально) Создайте суперпользователя для админ-панели
$env:USE_SQLITE = "1"
python backend/manage.py createsuperuser

# 6. Запустите сервер (порт 8000)
$env:USE_SQLITE = "1"
python backend/manage.py runserver 0.0.0.0:8000
```

Backend будет доступен на **http://localhost:8000/**

### Frontend

```bash
# 1. Перейдите в папку
cd frontend

# 2. Установите зависимости
npm install

# 3. Запустите дев-сервер Vite (портом 3000 или 5173 — смотрите вывод)
npm run dev
```

Frontend будет доступен на **http://localhost:3000/** (или **http://localhost:5173/**)

### Проверка

1. Откройте браузер на http://localhost:3000
2. Зарегистрируйтесь (или используйте существующие тестовые данные)
3. Посмотрите список задач, создавайте новые, подавайте заявки

## API Endpoints (примеры)

### Аутентификация

```bash
# Регистрация
POST /api/users/register/
Content-Type: application/json
{
  "email": "user@example.com",
  "username": "john",
  "password": "strongpass123",
  "password_confirm": "strongpass123"
}
```

Response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "john"
}
```

### Задачи

```bash
# Список всех задач (с фильтром по цене, городу, статусу)
GET /api/tasks/?price_min=1000&price_max=50000&city=Москва

# Создать задачу (требует аутентификации)
POST /api/tasks/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

title=Разработать сайт
description=Нужен сайт для кафе...
price=15000
city=Москва
importance=high

# Получить детали задачи
GET /api/tasks/{id}/

# Подать заявку на задачу
POST /api/tasks/{id}/apply/
{
  "cover_letter": "Я готов выполнить эту задачу..."
}
```

### Платежи (Escrow)

```bash
# Создать эскроу (работодатель финансирует задачу)
POST /api/payments/create/
{
  "task_id": 1
}

# Профинансировать эскроу
POST /api/payments/{escrow_id}/fund/

# Выпустить средства исполнителю
POST /api/payments/{escrow_id}/release/

# Получить список своих платежей
GET /api/payments/
```

### Профиль и резюме

```bash
# Получить текущего пользователя
GET /api/users/me/

# Обновить профиль
PUT /api/users/me/
Content-Type: multipart/form-data
username=john_updated
bio=Фронтенд разработчик

# Получить резюме
GET /api/users/me/resume/

# Обновить резюме
PUT /api/users/me/resume/
{
  "title": "Senior Developer",
  "summary": "Опыт 5+ лет...",
  "skills": "JavaScript,React,Node.js",
  "location": "Москва"
}

# Поиск специалистов
GET /api/users/search/?skill=React&location=Москва
```

## Переменные окружения

Файл `backend/.env`:

```bash
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,*

USE_SQLITE=1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

ACCESS_TOKEN_LIFETIME=30
REFRESH_TOKEN_LIFETIME=7
```

## Запуск через Docker

```bash
docker-compose up --build

# Фронтенд: http://localhost:3000
# Бэкенд: http://localhost:8000
# Админ-панель: http://localhost:8000/admin

docker-compose down
```

## Разработка

### Backend

```bash
# Создать миграцию
$env:USE_SQLITE = "1"
python backend/manage.py makemigrations

# Применить миграции
$env:USE_SQLITE = "1"
python backend/manage.py migrate

# Django Shell
$env:USE_SQLITE = "1"
python backend/manage.py shell

# Запустить тесты
python backend/manage.py test

# Проверка конфигурации
python backend/manage.py check
```

### Frontend

```bash
cd frontend

# Дев-сервер
npm run dev

# Собрать production версию
npm run build

# Lint проверка
npm run lint

# Превью production бандла
npm run preview
```

## Архитектура проекта

```
Student-Skill-Hub/
├── backend/
│   ├── config/              # Настройки Django
│   │   ├── settings.py      # Основной конфиг
│   │   ├── urls.py          # Маршруты API
│   │   ├── asgi.py          # ASGI для WebSocket
│   │   └── wsgi.py          # WSGI для продакшена
│   ├── apps/
│   │   ├── users/           # Аутентификация, профили, резюме
│   │   ├── tasks/           # Задачи, заявки, файлы
│   │   ├── payments/        # Эскроу, управление платежами
│   │   ├── reviews/         # Отзывы и рейтинг
│   │   ├── disputes/        # Разрешение конфликтов
│   │   ├── chat/            # WebSocket чат
│   │   └── core/            # Общие утилиты
│   ├── requirements.txt
│   ├── manage.py
│   └── db.sqlite3
├── frontend/
│   ├── src/
│   │   ├── pages/           # Основные страницы
│   │   ├── components/      # Переиспользуемые компоненты
│   │   ├── hooks/           # Custom React hooks
│   │   ├── api.ts           # Axios клиент
│   │   └── auth.ts          # Функции авторизации
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── docker-compose.yml
├── nginx/
│   └── nginx.conf
└── README.md
```

## WebSocket чат

Проект использует **Django Channels** для real-time чата:

```javascript
// Подключение браузером
const ws = new WebSocket("ws://localhost:8000/ws/chat/1/");

ws.onopen = () => {
  ws.send(JSON.stringify({ message: "Привет!" }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
```

## Файлы задач

- Загружаются в папку `backend/task_files/`
- Аватарки в `backend/avatars/`
- На продакшене используйте облачное хранилище (S3 и т.д.)

## Известные ограничения MVP

- Платежи — только mock (без реального перевода денег)
- Нет интеграции Stripe/PayPal
- Чат work in-memory (теряется при перезагрузке)
- Система диспутов только базовая
- Нет email уведомлений
- Нет полноценной модерации

## Дальнейшее развитие

1. Интеграция платежей (Stripe, Yandex.Kassa)
2. Email уведомления (Celery)
3. Advanced поиск (Elasticsearch)
4. Real-time уведомления (Redis, WebSocket)
5. CI/CD (GitHub Actions)
6. Мобильное приложение (React Native)
7. ML система рекомендаций

## Полезные ссылки

- [Django документация](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django Channels](https://channels.readthedocs.io/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Трубоустройство

Если возникли вопросы:
1. Проверьте логи сервера (терминал)
2. Убедитесь в установке зависимостей
3. Очистите браузер кэш (Ctrl+Shift+Del)
4. Перезагрузите сервер

---

**Успехов!** Проект готов к локальной разработке и MVP демонстрации.

