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

- **NEXT_PUBLIC_SITE_URL** — укажите `https://astrobyndauzh.com` (основной домен). От этого зависит, куда ведёт ссылка после оплаты. Если указать preview-URL (astro-ndauzh.vercel.app), страница success может отдать 404.
- **DATABASE_URL** — если используете Vercel Postgres, скопируйте строку подключения из панели и добавьте как `DATABASE_URL`
- **APIPAY_API_KEY** — ключ из личного кабинета ApiPay.kz (заголовок X-API-Key)
- **APIPAY_WEBHOOK_SECRET** — секрет для проверки подписи webhook (X-Webhook-Signature). Если ApiPay не шлёт подпись (sigLen: 0) — настройте в ApiPay (Создать подпись).
- **APIPAY_SKIP_WEBHOOK_VERIFY** — только для теста! `true` отключает проверку подписи. Не использовать в production.
- Webhook URL в ApiPay: `https://astrobyndauzh.com/api/payments/kaspi/webhook`
- После добавления переменных сделайте **Redeploy** проекта
