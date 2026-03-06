# Переменные окружения для Vercel

Для работы оплаты и сайта на Vercel добавьте в **Settings → Environment Variables**:

## Обязательные

| Переменная | Описание |
|------------|----------|
| `DATABASE_URL` | Строка подключения PostgreSQL (Neon, Supabase, Vercel Postgres и т.д.) |
| `APIPAY_API_KEY` | Ключ ApiPay.kz для Kaspi Pay |
| `APIPAY_WEBHOOK_SECRET` | Секрет для проверки webhook ApiPay |
| `YOOKASSA_SHOP_ID` | ID магазина ЮKassa |
| `YOOKASSA_SECRET_KEY` | Секретный ключ ЮKassa |

## Важно

- **DATABASE_URL** — если используете Vercel Postgres, скопируйте строку подключения из панели и добавьте как `DATABASE_URL`
- **APIPAY_API_KEY** — ключ из личного кабинета ApiPay.kz (заголовок X-API-Key)
- После добавления переменных сделайте **Redeploy** проекта
