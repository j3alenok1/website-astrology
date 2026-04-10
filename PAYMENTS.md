# Настройка платежей

## Актуально: только Stripe

| Поток | API | Переменная ссылки |
|--------|-----|-------------------|
| **Календарь** | `POST /api/payments/stripe-prepare-digital` | `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` |
| **Консультации** | `POST /api/payments/stripe-prepare-booking` | `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BOOKING` или та же `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` |

После оплаты Stripe шлёт **`checkout.session.completed`** на  
`https://astrobyndauzh.com/api/payments/stripe/webhook` — создаётся заявка (Lead), заказ помечается оплаченным.

Подробнее: [docs/VERCEL_ENV.md](docs/VERCEL_ENV.md).

### Несколько цен (консультации)

У Payment Link в Stripe **одна цена**. Для разных продуктов создайте **несколько ссылок** в Dashboard и сопоставьте их в коде или используйте одну ссылку `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BOOKING`, если все консультации стоят одинаково.

---

## Отключено (история в git)

- **Kaspi / ApiPay** — маршруты `410`
- **ЮKassa** — маршруты `410`, webhook отключён
