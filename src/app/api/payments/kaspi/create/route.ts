import { NextResponse } from 'next/server'

/**
 * Kaspi Pay (ApiPay) отключён — используется Stripe Payment Links.
 * Прежняя реализация: см. историю git (коммит до перехода на Stripe).
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Kaspi Pay отключён. Оплата — через Stripe.' },
    { status: 410 }
  )
}
