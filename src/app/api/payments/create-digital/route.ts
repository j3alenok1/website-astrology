import { NextResponse } from 'next/server'

/**
 * ЮKassa для цифрового продукта отключена — используется `/api/payments/stripe-prepare-digital`.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'ЮKassa отключена. Оплата календаря — через Stripe.' },
    { status: 410 }
  )
}

export const dynamic = 'force-dynamic'
