# Чеклист оплаты (Stripe)

## 1. Vercel — переменные (вариант A: Payment Link)

| Переменная | Где взять |
|------------|-----------|
| **`STRIPE_PAYMENT_LINK`** | Stripe → Payment Links → ссылка на продукт «Календарь» (`buy.stripe.com/...`) |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | Та же ссылка (дублирование для клиента; опционально, если задан серверный ключ) |
| `STRIPE_PAYMENT_LINK_BOOKING` / `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BOOKING` | *(опционально)* отдельная ссылка для консультаций |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys (Secret) |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → endpoint → Signing secret |
| `DATABASE_URL` | Neon / Vercel Postgres и т.д. |

Без `STRIPE_PAYMENT_LINK` (и без дубля `NEXT_PUBLIC_...`) потребуется пара **Buy Button** — см. [VERCEL_ENV.md](VERCEL_ENV.md) раздел «Альтернатива».

## 2. Stripe — webhook

- **URL:** `https://astrobyndauzh.com/api/payments/stripe/webhook`
- **Событие:** `checkout.session.completed`

## 3. Stripe — страница после оплаты

В настройках Payment Link укажите, например:

`https://astrobyndauzh.com/payment/success?product=astrologiya-otnosheniy&session_id={CHECKOUT_SESSION_ID}`

Для консультаций можно без `product` или с другим query — главное `session_id`.

## 4. Проверка

1. Redeploy на Vercel  
2. Календарь: форма → Stripe → оплата тестовой картой → заявка в админке  
3. Консультации: то же с формы записи  

ЮKassa и Kaspi не используются.
