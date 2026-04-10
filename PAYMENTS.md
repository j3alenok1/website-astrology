# Настройка платежей

## Актуально: только Stripe

**Рекомендуемый способ — Payment Link (редирект на Stripe):** задайте в Vercel **`STRIPE_PAYMENT_LINK`** (и при желании **`NEXT_PUBLIC_STRIPE_PAYMENT_LINK`** с той же ссылкой). Отдельные ключи Buy Button не нужны.

| Поток | API | Переменные |
|--------|-----|------------|
| **Календарь** | `POST /api/payments/stripe-prepare-digital` | `STRIPE_PAYMENT_LINK` (+ опционально `NEXT_PUBLIC_...`) |
| **Консультации** | `POST /api/payments/stripe-prepare-booking` | `STRIPE_PAYMENT_LINK_BOOKING` / `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BOOKING` или те же ссылки, что для календаря |

**Без ссылки на Payment Link** форма может показать встроенную Buy Button — тогда нужны `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` и `NEXT_PUBLIC_STRIPE_BUY_BUTTON_ID` (см. [docs/VERCEL_ENV.md](docs/VERCEL_ENV.md)).

После оплаты Stripe шлёт **`checkout.session.completed`** на  
`https://astrobyndauzh.com/api/payments/stripe/webhook` — создаётся заявка (Lead), заказ помечается оплаченным.

Подробнее: [docs/VERCEL_ENV.md](docs/VERCEL_ENV.md).

### Несколько цен (консультации)

У Payment Link в Stripe **одна цена**. Для разных продуктов создайте **несколько ссылок** в Dashboard и сопоставьте их в коде или используйте одну ссылку `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BOOKING`, если все консультации стоят одинаково.

---

## Отключено (история в git)

- **Kaspi / ApiPay** — маршруты `410`
- **ЮKassa** — маршруты `410`, webhook отключён
