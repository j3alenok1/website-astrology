# Настройка базы данных

## Вариант 1: Neon (бесплатно, рекомендуется)

1. **Регистрация:** [neon.tech](https://neon.tech) → Sign up (через GitHub)

2. **Создание проекта:**
   - New Project → укажите имя (например, `astro-ndauzh`)
   - Region: выберите ближайший (например, Frankfurt)
   - Create project

3. **Копирование строки подключения:**
   - На странице проекта найдите **Connection string**
   - Выберите **Prisma** (или обычный connection string)
   - Скопируйте строку вида:
     ```
     postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
     ```

4. **Добавление в Vercel:**
   - Settings → Environment Variables → Add
   - **Name:** `DATABASE_URL`
   - **Value:** вставьте скопированную строку
   - Environment: Production (и Preview, если нужно)

5. **Деплой:**
   - Сделайте Redeploy — при сборке выполнится `prisma db push` и создадутся таблицы

6. **Создание админа (локально):**
   ```bash
   # Создайте .env с DATABASE_URL (скопируйте из Neon)
   echo "DATABASE_URL=postgresql://..." > .env
   
   # Создайте админ-пользователя
   npx prisma db seed
   ```
   
   Или добавьте в Vercel переменные:
   - `ADMIN_EMAIL` = ваш email для входа в админку
   - `ADMIN_PASSWORD` = пароль
   
   Затем локально с `DATABASE_URL` в .env:
   ```bash
   npx prisma db seed
   ```

---

## Вариант 2: Vercel Postgres

1. В проекте Vercel откройте вкладку **Storage**
2. **Create Database** → **Postgres**
3. Подключите базу к проекту — `DATABASE_URL` добавится автоматически
4. **Redeploy** проекта
5. Создайте админа (см. шаг 6 выше)

---

## После настройки

- **Заявки** будут сохраняться в БД
- **Админка** `/admin` — просмотр и управление заявками
- **Email** продолжит приходить как раньше

---

## Команды для разработки

```bash
npm run db:push    # Применить схему к БД
npm run db:seed    # Создать админ-пользователя
npm run db:studio  # Открыть Prisma Studio (просмотр данных)
```
