# Переменные окружения для Vercel

Добавьте в **Settings → Environment Variables**:

## Обязательные

| Переменная | Описание |
|------------|----------|
| `DATABASE_URL` | PostgreSQL |
| `STRIPE_PAYMENT_LINK` | **Основной способ оплаты календаря:** ссылка Payment Link (`https://buy.stripe.com/...`) из Stripe Dashboard. API добавляет `client_reference_id` к заказу. |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | Дублируйте ту же ссылку (удобно для клиента; для редиректа достаточно `STRIPE_PAYMENT_LINK` на сервере). |
| `STRIPE_PAYMENT_LINK_BOOKING` / `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BOOKING` | *(опционально)* Отдельная ссылка для консультаций. Иначе используется `STRIPE_PAYMENT_LINK`. |
| `STRIPE_SECRET_KEY` | Secret key (Dashboard → Developers → API keys) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret вебхука `checkout.session.completed` → endpoint `/api/payments/stripe/webhook` |

## Альтернатива (без Payment Link)

Если **не** заданы `STRIPE_PAYMENT_LINK` / `NEXT_PUBLIC_STRIPE_PAYMENT_LINK`, на странице календаря показывается встроенная **Buy Button** — тогда нужны:

| Переменная | Описание |
|------------|----------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key (Developers → API keys) |
| `NEXT_PUBLIC_STRIPE_BUY_BUTTON_ID` | ID из **Buy button** в Stripe (`buy_btn_...`) |

## Важно

- **NEXT_PUBLIC_SITE_URL** — `https://astrobyndauzh.com`
- В Stripe Payment Link после оплаты:  
  `https://astrobyndauzh.com/payment/success?product=...&session_id={CHECKOUT_SESSION_ID}`  
  (для календаря — `product=astrologiya-otnosheniy`; для консультаций можно без `product` или свой слаг)
- **Webhook:** `https://astrobyndauzh.com/api/payments/stripe/webhook`, событие `checkout.session.completed`
- ЮKassa и Kaspi в коде отключены; переменные `YOOKASSA_*` и `APIPAY_*` не нужны.

После изменений — **Redeploy**.
