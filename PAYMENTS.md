# Настройка платежей

## Как это работает

- **Клиенты из Алматы** → Kaspi Pay (счёт приходит в приложение Kaspi.kz)
- **Остальные** → ЮKassa (оплата картой на странице)

### Kaspi Pay (Алматы)

1. Клиент указывает город «Алматы» → выбирает продукт → заполняет форму
2. Нажимает «Оплатить» → счёт создаётся через ApiPay.kz
3. Клиент получает счёт в приложении Kaspi.kz на свой номер
4. Оплачивает в приложении → webhook создаёт Lead, отправляет email

### ЮKassa (все остальные)

1. Клиент выбирает продукт → заполняет форму → «Оплатить»
2. Перенаправляется на страницу ЮKassa
3. Оплачивает картой → webhook создаёт Lead
4. Клиент видит «Оплата прошла успешно»

---

## Kaspi Pay (ApiPay.kz) — только Алматы

1. Зарегистрируйтесь на [apipay.kz](https://apipay.kz)
2. Свяжитесь с поддержкой (WhatsApp +7 708 516 74 89) для подключения Kaspi Business
3. Получите API ключ в кабинете
4. Добавьте в Vercel: `APIPAY_API_KEY`, `APIPAY_WEBHOOK_SECRET`
5. В ApiPay.kz → Настройки → Webhooks: URL `https://astrobyndauzh.com/api/payments/kaspi/webhook`, событие `invoice.status_changed`

---

## ЮKassa — все остальные города

### Шаг 1. Регистрация в ЮKassa

1. Зайдите на [yookassa.ru](https://yookassa.ru)
2. Создайте магазин
3. В настройках скопируйте **shopId** и **secret key**

---

## Шаг 2. Переменные в Vercel

Добавьте в Environment Variables:

- `YOOKASSA_SHOP_ID` — идентификатор магазина
- `YOOKASSA_SECRET_KEY` — секретный ключ

---

## Шаг 3. Webhook

В личном кабинете ЮKassa:

1. Настройки → Уведомления
2. URL: `https://astrobyndauzh.com/api/payments/webhook`
3. События: `payment.succeeded`

---

## Шаг 4. Валюта

По умолчанию используется **KZT** (тенге). Если ЮKassa не поддерживает KZT в вашем регионе, измените в `src/app/api/payments/create/route.ts`:

```ts
currency: 'RUB',  // вместо KZT
```

И обновите цены в `src/lib/products.ts` — `amountTiyin` станет `amountKopecks` (копейки для рубля).

---

## Проверка

1. Redeploy проекта
2. Выберите продукт → заполните форму → нажмите «Оплатить»
3. Должен открыться экран ЮKassa
4. Для теста используйте [тестовые карты ЮKassa](https://yookassa.ru/developers/payment-acceptance/testing-and-going-live/testing)
