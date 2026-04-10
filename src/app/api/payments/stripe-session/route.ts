import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

/** Разрешить success-странице получить orderId по session_id после Stripe Checkout */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!sessionId || !key) {
    return NextResponse.json({ error: 'Нет session_id или STRIPE_SECRET_KEY' }, { status: 400 })
  }

  try {
    const stripe = new Stripe(key)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return NextResponse.json({
      orderId: session.client_reference_id ?? null,
      paymentStatus: session.payment_status,
    })
  } catch (e) {
    console.error('[STRIPE] session retrieve:', e)
    return NextResponse.json({ error: 'Не удалось получить сессию' }, { status: 502 })
  }
}
