import { NextResponse } from 'next/server'

/**
 * Kaspi Pay (ApiPay) отключён — цифровой продукт оплачивается через Stripe Payment Link.
 * Прежняя реализация: см. историю git.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Kaspi Pay отключён. Используйте оплату картой через Stripe.' },
    { status: 410 }
  )
}
