# Переменные окружения для Vercel

Добавьте в **Settings → Environment Variables**:

## Обязательные

| Переменная | Описание |
|------------|----------|
| `DATABASE_URL` | PostgreSQL |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | Stripe Payment Link для **календаря** (публичная ссылка) |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BOOKING` | *(опционально)* Отдельная ссылка для **консультаций** с нужной ценой в Stripe. Если не задана, используется `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` (тогда сумма в Stripe должна совпадать с продуктом или создайте отдельные ссылки в Dashboard). |
| `STRIPE_SECRET_KEY` | Secret key (Dashboard → Developers → API keys) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret вебхука `checkout.session.completed` → endpoint `/api/payments/stripe/webhook` |

## Важно

- **NEXT_PUBLIC_SITE_URL** — `https://astrobyndauzh.com`
- В Stripe Payment Link после оплаты:  
  `https://astrobyndauzh.com/payment/success?product=...&session_id={CHECKOUT_SESSION_ID}`  
  (для календаря — `product=astrologiya-otnosheniy`; для консультаций можно без `product` или свой слаг)
- **Webhook:** `https://astrobyndauzh.com/api/payments/stripe/webhook`, событие `checkout.session.completed`
- ЮKassa и Kaspi в коде отключены; переменные `YOOKASSA_*` и `APIPAY_*` не нужны.

После изменений — **Redeploy**.
