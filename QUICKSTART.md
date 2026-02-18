# ⚡ Быстрый старт

## Шаг 1: Установка зависимостей

```bash
npm install
```

## Самый простой запуск (Windows)

В репозитории есть скрипт, который сам:
- создаст `.env` (если нет),
- поднимет PostgreSQL через Docker,
- установит зависимости (если нет `node_modules`),
- применит Prisma схему и создаст админа,
- запустит сайт.

Запуск одной командой:

```bash
npm run dev:easy
```

Либо двойной клик по `tools/start-dev.cmd`.

## Шаг 2: Запуск PostgreSQL через Docker

```bash
docker-compose up -d
```

Или используйте существующий PostgreSQL и обновите `DATABASE_URL` в `.env`.

## Шаг 3: Настройка переменных окружения

Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

**Минимальная конфигурация для запуска:**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/astro_consult?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
RECAPTCHA_SECRET_KEY="your-recaptcha-secret-key"
NEXT_PUBLIC_DISABLE_RECAPTCHA=true
DISABLE_RECAPTCHA=true
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

**Для получения ключей reCAPTCHA:**
1. Перейдите на https://www.google.com/recaptcha/admin/create
2. Выберите reCAPTCHA v2 → "Я не робот"
3. Добавьте домен (localhost для разработки)
4. Скопируйте Site Key и Secret Key в `.env`

## Шаг 4: Инициализация базы данных

```bash
# Генерация Prisma Client
npm run db:generate

# Применение схемы к БД
npm run db:push

# Создание админ-пользователя
npm run db:seed
```

## Шаг 5: Запуск dev сервера

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Шаг 6: Вход в админ-панель

Перейдите на [http://localhost:3000/admin](http://localhost:3000/admin)

Используйте учетные данные из `.env`:
- Email: значение `ADMIN_EMAIL`
- Пароль: значение `ADMIN_PASSWORD`

## Что дальше?

- Настройте email уведомления (SMTP в `.env`)
- Добавьте Google Analytics ID (`NEXT_PUBLIC_GA_ID`)
- Добавьте Meta Pixel ID (`NEXT_PUBLIC_META_PIXEL_ID`)
- Настройте интеграцию с Google Sheets (опционально)
- Настройте CRM webhook (опционально)

## Проблемы?

1. **Ошибка подключения к БД**: Проверьте, что PostgreSQL запущен и `DATABASE_URL` правильный
2. **Ошибка Prisma**: Убедитесь, что выполнили `npm run db:generate` и `npm run db:push`
3. **Ошибка reCAPTCHA**: Проверьте, что ключи добавлены в `.env` и домен добавлен в настройках reCAPTCHA
