import { NextResponse } from 'next/server'

/**
 * Синхронизация со статусом Kaspi/ApiPay отключена.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Синхронизация Kaspi отключена. Используется Stripe.' },
    { status: 410 }
  )
}
