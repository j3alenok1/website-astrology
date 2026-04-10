import { NextResponse } from 'next/server'

/**
 * Webhook ApiPay (Kaspi) отключён — используется Stripe webhook.
 * Прежняя реализация: см. историю git.
 */
export async function POST() {
  return NextResponse.json({ received: true, disabled: true })
}
