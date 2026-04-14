# 🚀 Как выгрузить сайт на домен

## Вариант 1: Vercel (проще всего, бесплатно)

1. **Зарегистрируйтесь** на [vercel.com](https://vercel.com) (через GitHub).

2. **Загрузите проект в GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ВАШ_ЛОГИН/astro-ndauzh.git
   git push -u origin main
   ```

3. **Подключите репозиторий к Vercel:**
   - New Project → Import Git Repository → выберите ваш репозиторий
   - Framework: Next.js (определится автоматически)

4. **Добавьте переменные окружения** в Vercel (Settings → Environment Variables):
   - `SMTP_HOST` = smtp.gmail.com
   - `SMTP_PORT` = 587
   - `SMTP_USER` = mari.makk80@gmail.com
   - `SMTP_PASSWORD` = ваш пароль приложения Gmail
   - `SMTP_FROM` = mari.makk80@gmail.com
   - `SMTP_TO` = mari.makk80@gmail.com
   - `NEXTAUTH_URL` = https://ваш-домен.vercel.app
   - `NEXTAUTH_SECRET` = сгенерируйте случайную строку
   - `NEXT_PUBLIC_SITE_URL` = https://ваш-домен.vercel.app
   - `DISABLE_RECAPTCHA` = false (в продакшне включите reCAPTCHA)
   - `NEXT_PUBLIC_DISABLE_RECAPTCHA` = false
   - `RECAPTCHA_SECRET_KEY` и `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` — если включите reCAPTCHA

5. **Deploy** — Vercel соберёт проект и выдаст ссылку вида `astro-ndauzh.vercel.app`.

6. **Свой домен:**
   - В Vercel: Project → Settings → Domains → Add
   - Укажите ваш домен (например, astro-ndauzh.kz)
   - Настройте DNS у регистратора: добавьте A-запись или CNAME по инструкции Vercel

---

## Вариант 2: Netlify

1. Зарегистрируйтесь на [netlify.com](https://netlify.com).
2. New site from Git → выберите репозиторий.
3. Build command: `npm run build`
4. Publish directory: `.next` (для Next.js на Netlify может потребоваться плагин)
5. Добавьте переменные окружения в Site settings → Environment variables.

---

## Вариант 3: VPS (свой сервер)

Если у вас есть VPS (Timeweb, Selectel, DigitalOcean и т.п.):

1. **Установите Node.js 18+** на сервер.

2. **Загрузите проект:**
   ```bash
   git clone https://github.com/ВАШ_ЛОГИН/astro-ndauzh.git
   cd astro-ndauzh
   npm install
   ```

3. **Создайте `.env`** с вашими настройками.

4. **Соберите и запустите:**
   ```bash
   npm run build
   npm run start
   ```

5. **Используйте PM2** для работы в фоне:
   ```bash
   npm install -g pm2
   pm2 start npm --name "astro" -- start
   pm2 save
   pm2 startup
   ```

6. **Nginx** как обратный прокси (опционально) для HTTPS и домена.

---

## База данных (опционально)

Сейчас форма работает **без БД** — заявки приходят на почту. Если нужна админ-панель и сохранение в БД:

- **Neon** (neon.tech) — бесплатный PostgreSQL
- **Supabase** (supabase.com) — PostgreSQL + доп. функции

Скопируйте `DATABASE_URL` из панели и добавьте в переменные окружения на Vercel/Netlify. Затем выполните `npx prisma db push` (через Vercel CLI или при первом деплое).

---

## Чек-лист перед деплоем

- [ ] Все переменные из `.env` перенесены в панель хостинга
- [ ] `NEXT_PUBLIC_SITE_URL` и `NEXTAUTH_URL` указывают на ваш домен
- [ ] reCAPTCHA настроена (или оставьте DISABLE_RECAPTCHA=true для теста)
- [ ] Пароль приложения Gmail в `SMTP_PASSWORD`
- [ ] Файл `6.png` в `public/` (если используется фон)
