# Student Skill Hub

Платформа для поиска и выполнения фрилансерских задач. Студенты могут искать работу, работодатели — находить исполнителей.

## Быстрый старт с Docker (легче всего)

### Что нужно установить:
- Docker
- Docker Compose

### Как запустить:

```bash
docker-compose up -d
```

Всё. Дождись, когда завершится, потом открой в браузере:
- Фронтенд: http://localhost:3000
- Админка: http://localhost:8000/admin (логин: admin, пароль: admin)

Чтобы остановить:
```bash
docker-compose down
```

---

## Запуск без Docker (на компе)

### Что нужно установить:
- Python 3.11+
- Node.js 18+
- PostgreSQL 15
- Redis 7

### Шаг 1: Раздачи переменные окружения

Создай файл `.env` в корне проекта:

```
POSTGRES_DB=studentskillhub
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost

REDIS_URL=redis://localhost:6379

SECRET_KEY=твой-секретный-ключ-можно-любой
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Шаг 2: Backend

```bash
cd backend

# Установи зависимости
pip install -r requirements.txt

# Примени миграции БД
python manage.py migrate

# Создай администратора
python manage.py createsuperuser

# Запусти сервер
python manage.py runserver
```

Backend будет на http://localhost:8000

### Шаг 3: Frontend

```bash
cd frontend

# Установи зависимости
npm install

# Запусти
npm run dev
```

Frontend будет на http://localhost:3000

---

## Что здесь есть

**Главные возможности:**
- Создание и редактирование задач (с городом, сроком, сложностью)
- Поиск фрилансеров по навыкам и городу
- Отклики на задачи
- Система отзывов и оценок
- Резюме фрилансера в профиле
- Чат между пользователями
- Система платежей через Stripe

---

## Для разработки

Если хочешь что-то менять в коде:

**Backend изменения:**
- Коды в папке `backend/apps/`
- После изменения моделей: `python manage.py makemigrations` затем `python manage.py migrate`
- Перезагрузи сервер (Ctrl+C и снова `python manage.py runserver`)

**Frontend изменения:**
- Коды в папке `frontend/src/`
- Сервер автоматически перезагружается при сохранении

---

## Проблемы при запуске

**Docker не работает:**
- Проверь, запущен ли Docker Desktop
- На Linux может потребоваться `sudo`

**PostgreSQL не подключается:**
- Проверь, запущена ли База данных
- Правильны ли пароли в `.env`

**Redis ошибка:**
- Убедись, что Redis запущен
- Или закомментируй Redis строки в `config/settings.py` если оно не критично

**Npm ошибка:**
- Удали `node_modules` и `package-lock.json`
- Заново запусти `npm install`

---

## Структура папок

```
backend/          - Django сервер (API)
frontend/         - React (интерфейс)
nginx/            - Настройка веб-сервера
docker-compose.yml - Конфиг для Docker
```

---

## Готово!

Если что-то не работает — проверь консоль на ошибки и убедись, что все зависимости установлены правильно.
