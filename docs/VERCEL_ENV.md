# Переменные окружения для Vercel

Добавьте в **Settings → Environment Variables**:

## Обязательные

| Переменная | Описание |
|------------|----------|
| `DATABASE_URL` | PostgreSQL |
| `STRIPE_PAYMENT_LINK` | Ссылка Payment Link (`buy.stripe.com/...`). Если не задана — на странице календаря показывается **Buy Button** (нужны `NEXT_PUBLIC_*` ниже). |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | Дублируйте ту же ссылку (для клиента, если понадобится) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key (Dashboard → Developers → API keys) — для встроенной Buy Button |
| `NEXT_PUBLIC_STRIPE_BUY_BUTTON_ID` | ID кнопки из **Buy button** в Stripe (начинается с `buy_btn_`) |
| `STRIPE_PAYMENT_LINK_BOOKING` / `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BOOKING` | *(опционально)* Отдельная ссылка для консультаций. Иначе используется `STRIPE_PAYMENT_LINK`. |
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
