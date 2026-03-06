# Чеклист: что нужно для работы оплаты

## 1. Vercel — переменные окружения

В **Vercel** → проект → **Settings** → **Environment Variables** добавьте:

| Переменная | Где взять |
|------------|-----------|
| `DATABASE_URL` | PostgreSQL: Neon, Supabase, Vercel Postgres. Скопируйте Connection String |
| `APIPAY_API_KEY` | ApiPay.kz → личный кабинет → API ключ |
| `APIPAY_WEBHOOK_SECRET` | ApiPay.kz → Настройки → Webhooks → секретный ключ |
| `YOOKASSA_SHOP_ID` | yookassa.ru → настройки магазина |
| `YOOKASSA_SECRET_KEY` | yookassa.ru → настройки магазина |

## 2. ApiPay.kz — настройка webhook

1. Войдите на [apipay.kz](https://apipay.kz)
2. **Настройки** → **Webhooks**
3. Добавьте:
   - **URL:** `https://astrobyndauzh.com/api/payments/kaspi/webhook`
   - **Событие:** `invoice.status_changed`
4. Сохраните — ApiPay покажет **секретный ключ**. Добавьте его в Vercel как `APIPAY_WEBHOOK_SECRET`

## 3. Redeploy

После добавления всех переменных:
- **Vercel** → **Deployments** → три точки у последнего деплоя → **Redeploy**

## 4. Цифровой продукт (календарь)

Оплата календаря на `/relationshipastrology` работает через форму с выбором «Kaspi» или «Карта».  
Кнопка «Записаться и оплатить» на главной убрана — осталась только «Записаться» (заявка без оплаты).

---

**Если что-то не работает:** проверьте логи в Vercel → **Logs** после попытки оплаты.
