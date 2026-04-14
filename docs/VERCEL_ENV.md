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

## Опционально: Telegram (дубли заявок с формы)

| Переменная | Описание |
|------------|----------|
| `TELEGRAM_BOT_TOKEN` | Токен бота от [@BotFather](https://t.me/BotFather) |
| `TELEGRAM_CHAT_ID` | См. ниже: для **личного чата** — **число** `chat_id`, не `@username` |

В тексте уведомления есть строка «У вас новая заявка с сайта!» и упоминание `@whitewidowz`, плюс кратко имя, контакт, продукт и запрос.

### Как узнать `TELEGRAM_CHAT_ID` для лички (после `/start` боту)

1. В Telegram напишите **вашему** боту `/start`.
2. В браузере откройте: `https://api.telegram.org/bot` + **токен бота** + `/getUpdates`  
   (одна строка URL, токен тот же, что в `TELEGRAM_BOT_TOKEN`).
3. В JSON найдите `"chat":{"id":` **число** — это и есть `TELEGRAM_CHAT_ID` (без кавычек, только цифры).
4. Вставьте число в Vercel → **Redeploy**.

Для **личного чата** `@username` в API часто даёт `chat not found`, даже если `/start` был — используйте **числовой** `id`.

Если в логах **`bots can't send messages to bots`** — в `TELEGRAM_CHAT_ID` попал **id другого бота** (часто путают с «Selected User» в сторонних ботах). Нужен `message.chat.id` из **getUpdates вашего** бота после `/start` с **личного** аккаунта Telegram (не бота).

**Канал:** `TELEGRAM_CHAT_ID` = `@ваш_канал`, бот — **администратор** канала.

## SMTP (письма о заявках)

| Переменная | Пример |
|------------|--------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Gmail, с которого идёт отправка |
| `SMTP_PASSWORD` | [пароль приложения](https://myaccount.google.com/apppasswords) (не обычный пароль) |
| `SMTP_FROM` | Совпадает с `SMTP_USER` (для Gmail обязательно) |
| `SMTP_TO` | Куда копировать заявки, например `mari.makk80@gmail.com` |

После изменений — **Redeploy**.

### Диагностика (Vercel → Logs → функция `/api/leads`)

В логах ищите строки `[LEADS] Email отправлен`, `[LEADS] Telegram: сообщение отправлено` или текст ошибки `Ошибка отправки email`, `Telegram API:` с `description` от Telegram.

### Проверка Telegram без формы

1. В Vercel добавьте **`TELEGRAM_TEST_SECRET`** (длинная случайная строка), **Redeploy**.
2. Вызовите **POST** `https://ваш-домен.com/api/telegram/test` с заголовком  
   **`x-telegram-test-secret: <то же значение, что TELEGRAM_TEST_SECRET>`**
3. В ответе JSON: **`getMe`** — токен бота валиден; **`ping`** — результат `sendMessage`.  
4. Удалите `TELEGRAM_TEST_SECRET` после проверки.

Убедитесь, что **`/start` написан именно тому боту**, чей токен в `TELEGRAM_BOT_TOKEN` (если ботов несколько — id из getUpdates должен быть от **этого** бота).
