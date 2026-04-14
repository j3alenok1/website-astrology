# 🌌 Astro Consult - Персональный сайт консультанта

Современный интеллектуальный консультационный сервис, использующий методологию астрологии, таро и психологического анализа.

## 🚀 Технологии

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** для стилизации
- **Prisma** + **PostgreSQL** для базы данных
- **NextAuth.js** для админ-панели
- **Framer Motion** для анимаций
- **React Hook Form** + **Zod** для валидации форм
- **Google reCAPTCHA** для защиты
- **Nodemailer** для уведомлений
- **Google Analytics** + **Meta Pixel** для аналитики

## 📋 Требования

- Node.js 18+ 
- PostgreSQL (или Docker для запуска БД)

## 🛠️ Установка

1. **Клонируйте репозиторий и установите зависимости:**

```bash
npm install
```

2. **Настройте переменные окружения:**

Скопируйте `.env.example` в `.env` и заполните все необходимые значения:

```bash
cp .env.example .env
```

3. **Запустите PostgreSQL через Docker (опционально):**

```bash
docker-compose up -d
```

4. **Настройте базу данных:**

```bash
npm run db:generate
npm run db:push
```

5. **Создайте админ-пользователя:**

Запустите Prisma Studio и создайте пользователя вручную, или используйте seed скрипт (см. `prisma/seed.ts`).

6. **Запустите dev сервер:**

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

### 📧 Проверка отправки заявок на почту

Заявки отправляются на **mari.makk80@gmail.com** (настраивается в `.env` через `SMTP_TO`).

**Важно:** Gmail не принимает обычный пароль. Нужен **пароль приложения**:

1. Включите [двухэтапную аутентификацию](https://myaccount.google.com/security) в Google-аккаунте
2. Создайте пароль приложения: [Пароли приложений](https://myaccount.google.com/apppasswords)
3. В `.env` укажите `SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx` (16 символов без пробелов)
4. Запустите `npm run dev` и откройте: [http://localhost:3000/api/test-email](http://localhost:3000/api/test-email)
5. Если письмо пришло — форма заявок настроена верно

## 📁 Структура проекта

```
├── src/
│   ├── app/              # Next.js App Router страницы
│   ├── components/        # React компоненты
│   ├── lib/              # Утилиты и конфигурация
│   └── types/            # TypeScript типы
├── prisma/               # Prisma схема и миграции
└── public/               # Статические файлы
```

## 🔐 Админ-панель

Доступна по адресу `/admin`. Используйте учетные данные из `.env` файла.

## 📊 Функции

- ✅ Современный космический дизайн с анимациями
- ✅ Адаптивная mobile-first верстка
- ✅ SEO-оптимизация (мета-теги, sitemap, robots.txt)
- ✅ Форма записи с валидацией и reCAPTCHA
- ✅ Сохранение заявок в PostgreSQL
- ✅ Email уведомления
- ✅ Интеграция с Google Sheets (опционально)
- ✅ CRM вебхуки (опционально)
- ✅ Google Analytics + Meta Pixel
- ✅ UTM tracking
- ✅ Админ-панель с экспортом данных
- ✅ Безопасность (HTTPS, CSP headers)

## 🚢 Деплой

Подробная инструкция: **[DEPLOY.md](./DEPLOY.md)**

Кратко: загрузите проект в GitHub → подключите к [Vercel](https://vercel.com) → добавьте переменные окружения → получите ссылку. Свой домен подключается в настройках Vercel.

## 📝 Лицензия

MIT
