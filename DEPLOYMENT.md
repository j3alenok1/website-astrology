# 🚀 Руководство по развертыванию

## Локальная разработка

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка базы данных

#### Вариант A: Docker (рекомендуется)

```bash
docker-compose up -d
```

#### Вариант B: Локальный PostgreSQL

Установите PostgreSQL и создайте базу данных:

```sql
CREATE DATABASE astro_consult;
```

### 3. Настройка переменных окружения

Скопируйте `.env.example` в `.env` и заполните все значения:

```bash
cp .env.example .env
```

**Обязательные переменные:**
- `DATABASE_URL` - строка подключения к PostgreSQL
- `NEXTAUTH_SECRET` - секретный ключ (сгенерируйте: `openssl rand -base64 32`)
- `ADMIN_EMAIL` - email администратора
- `ADMIN_PASSWORD` - пароль администратора (будет захеширован)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - ключ reCAPTCHA
- `RECAPTCHA_SECRET_KEY` - секретный ключ reCAPTCHA

**Опциональные переменные:**
- `SMTP_*` - настройки email уведомлений
- `GOOGLE_SHEETS_*` - интеграция с Google Sheets
- `CRM_WEBHOOK_URL` - URL вебхука для CRM
- `NEXT_PUBLIC_YANDEX_METRIKA_ID` - Яндекс.Метрика (номер счётчика)
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `NEXT_PUBLIC_META_PIXEL_ID` - Meta Pixel ID

### 4. Инициализация базы данных

```bash
# Генерация Prisma Client
npm run db:generate

# Применение схемы к БД
npm run db:push

# Создание админ-пользователя
npm run db:seed
```

### 5. Запуск dev сервера

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Продакшн деплой

### Vercel (рекомендуется)

1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения в **Settings → Environment Variables**:
   - `DATABASE_URL` — строка подключения PostgreSQL
   - `NEXTAUTH_SECRET` — секретный ключ
   - `NEXTAUTH_URL` — https://ваш-домен.vercel.app
   - **Для email-уведомлений о заявках (обязательно для получения писем):**
     - `SMTP_HOST` = `smtp.gmail.com`
     - `SMTP_PORT` = `587`
     - `SMTP_USER` = `mari.makk80@gmail.com`
     - `SMTP_PASSWORD` = пароль приложения Gmail (16 символов, создать: [Google App Passwords](https://myaccount.google.com/apppasswords))
     - `SMTP_FROM` = `mari.makk80@gmail.com`
     - `SMTP_TO` = `mari.makk80@gmail.com`
   - `RECAPTCHA_SECRET_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
3. Настройте PostgreSQL (Vercel Postgres или внешний)
4. Запустите миграции: `npm run db:push`
5. Создайте админ-пользователя: `npm run db:seed`

### Другие платформы

Проект совместим с любой платформой, поддерживающей Next.js:
- Netlify
- Railway
- Render
- DigitalOcean App Platform

**Важно для продакшна:**
- Используйте HTTPS (обязательно для reCAPTCHA)
- Настройте переменную `NEXT_PUBLIC_SITE_URL` на ваш домен
- Используйте сильный `NEXTAUTH_SECRET`
- Настройте резервное копирование БД
- Мониторьте логи и ошибки

## Оптимизация производительности

### Lighthouse Score 90+

Проект уже оптимизирован для высоких показателей:

- ✅ Server-side rendering (SSR)
- ✅ Image optimization (Next.js Image)
- ✅ Code splitting
- ✅ CSS optimization (Tailwind)
- ✅ Минификация и сжатие
- ✅ Lazy loading компонентов
- ✅ Оптимизация шрифтов

### Дополнительные рекомендации:

1. **CDN**: Используйте CDN для статических ресурсов
2. **Кэширование**: Настройте кэширование заголовков
3. **Database**: Используйте connection pooling для PostgreSQL
4. **Monitoring**: Настройте мониторинг (Sentry, LogRocket и т.д.)

## Безопасность

- ✅ HTTPS обязателен
- ✅ reCAPTCHA защита форм
- ✅ Rate limiting на API
- ✅ Валидация данных (Zod)
- ✅ SQL injection защита (Prisma)
- ✅ XSS защита (React)
- ✅ CSP headers
- ✅ Security headers (middleware)

## Методичка «Астрология Отношений» (7 777 ₸) — Метрика и реклама

Продукт имеет отдельные цели Яндекс.Метрики для настройки рекламы.

### Цели в Метрике

1. **metodichka_pay_click** — клик по кнопке «Оплатить» (переход к оплате)
2. **metodichka_purchase** — успешная оплата (конверсия, выручка 7 777 ₸)

**Настройка в [metrika.yandex.ru](https://metrika.yandex.ru):**
- Настройки → Цели → Добавить цель
- Тип: «JavaScript-событие»
- Идентификатор цели: `metodichka_pay_click` (для клика) или `metodichka_purchase` (для покупки)
- Для `metodichka_purchase` можно включить «Цена цели» — выручка передаётся автоматически (7 777 ₸, KZT)

### Реклама (Яндекс.Директ, таргет и др.)

**URL для объявлений:**
```
https://ваш-домен.com/relationshipastrology?utm_source=yandex&utm_medium=cpc&utm_campaign=metodichka_7777
```

Меняйте `utm_campaign`, `utm_content`, `utm_term` для разных кампаний — данные сохраняются в заказе и в Метрике.

**Связка с Яндекс.Директ:** Настройки → Цели → привяжите цель `metodichka_purchase` для оптимизации по конверсиям.

## Поддержка

При возникновении проблем проверьте:
1. Логи приложения
2. Логи базы данных
3. Переменные окружения
4. Сетевое подключение
