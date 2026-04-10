# Переменные окружения для Vercel

Для работы оплаты и сайта на Vercel добавьте в **Settings → Environment Variables**:

## Обязательные

| Переменная | Описание |
|------------|----------|
| `DATABASE_URL` | Строка подключения PostgreSQL (Neon, Supabase, Vercel Postgres и т.д.) |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | Публичная ссылка Stripe Payment Link (календарь). Тест: `https://buy.stripe.com/test_...`, прод: `https://buy.stripe.com/...` |
| `STRIPE_SECRET_KEY` | Секретный ключ из Stripe Dashboard (для webhook и API сессии) |
| `STRIPE_WEBHOOK_SECRET` | Секрет подписи webhook (Signing secret в Stripe → Developers → Webhooks) |
| `YOOKASSA_SHOP_ID` | ID магазина ЮKassa (консультации) |
| `YOOKASSA_SECRET_KEY` | Секретный ключ ЮKassa |

## Важно

- **NEXT_PUBLIC_SITE_URL** — укажите `https://astrobyndauzh.com` (основной домен). От этого зависит, куда ведёт ссылка после оплаты.
- **Stripe Payment Link** — в настройках ссылки после оплаты укажите страницу успеха, например:  
  `https://astrobyndauzh.com/payment/success?product=astrologiya-otnosheniy&session_id={CHECKOUT_SESSION_ID}`  
  (подставьте свой slug продукта при необходимости).
- **Webhook Stripe**: URL `https://astrobyndauzh.com/api/payments/stripe/webhook`, событие `checkout.session.completed`.
- Kaspi Pay (ApiPay) в коде отключён; переменные `APIPAY_*` не требуются.

После добавления переменных сделайте **Redeploy** проекта.
