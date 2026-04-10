import { NextResponse } from 'next/server'

/**
 * Webhook ЮKassa отключён — используется `/api/payments/stripe/webhook`.
 */
export async function POST() {
  return NextResponse.json({ received: true, disabled: true })
}

export const dynamic = 'force-dynamic'
