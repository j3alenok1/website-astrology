import { NextResponse } from 'next/server'

/**
 * ЮKassa отключена — консультации оплачиваются через Stripe (`/api/payments/stripe-prepare-booking`).
 * Прежняя реализация: см. историю git.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        'ЮKassa отключена. Используйте оплату через Stripe (кнопка «Оплатить» на сайте обновлена).',
    },
    { status: 410 }
  )
}

export const dynamic = 'force-dynamic'
