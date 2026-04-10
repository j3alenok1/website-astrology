import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

async function sendPaymentEmail(leadData: {
  name: string
  contact: string
  productTitle: string
  amount: number
  birthDate: string
  birthTime?: string
  city: string
  birthCity?: string
  request?: string
}) {
  const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  }

  if (!smtpConfig.host || !smtpConfig.auth.user || !smtpConfig.auth.pass) return

  const amountFormatted = (leadData.amount / 100).toLocaleString('ru-KZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  try {
    const transporter = nodemailer.createTransport(smtpConfig)
    await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpConfig.auth.user,
      to: process.env.SMTP_TO || smtpConfig.auth.user,
      subject: `💰 Stripe: Оплачено — ${leadData.productTitle} — ${leadData.name}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; padding: 20px;">
  <h2 style="color: #7c3aed;">💰 Оплата Stripe получена</h2>
  <p><strong>Продукт:</strong> ${leadData.productTitle}</p>
  <p><strong>Сумма:</strong> ${amountFormatted} ₸</p>
  <p><strong>Клиент:</strong> ${leadData.name}</p>
  <p><strong>Контакты:</strong> ${leadData.contact}</p>
  <p style="color: #666; font-size: 12px;">${new Date().toLocaleString('ru-RU')}</p>
</body>
</html>
      `,
    })
  } catch (err) {
    console.error('[STRIPE] Email error:', err)
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!secret || !key) {
    console.error('[STRIPE] STRIPE_WEBHOOK_SECRET или STRIPE_SECRET_KEY не заданы')
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const stripe = new Stripe(key)
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    console.error('[STRIPE] Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const orderId = session.client_reference_id
  if (!orderId) {
    console.error('[STRIPE] Webhook: no client_reference_id')
    return NextResponse.json({ received: true })
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      console.error('[STRIPE] Webhook: order not found', orderId)
      return NextResponse.json({ received: true })
    }

    if (order.status === 'paid') {
      return NextResponse.json({ received: true })
    }

    const lead = await prisma.lead.create({
      data: {
        name: order.name,
        birthDate: order.birthDate,
        birthTime: order.birthTime,
        city: order.city,
        birthCity: order.birthCity,
        contact: order.contact,
        request: order.request,
        consent: order.consent,
        productSlug: order.productSlug,
        productTitle: order.productTitle,
        amount: order.amount,
        orderId: order.id,
        paymentStatus: 'paid',
        utmSource: order.utmSource,
        utmMedium: order.utmMedium,
        utmCampaign: order.utmCampaign,
        utmTerm: order.utmTerm,
        utmContent: order.utmContent,
        referrer: order.referrer,
        userAgent: order.userAgent,
        ipAddress: order.ipAddress,
      },
    })

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'paid', leadId: lead.id },
    })

    await sendPaymentEmail({
      name: order.name,
      contact: order.contact,
      productTitle: order.productTitle,
      amount: order.amount,
      birthDate: order.birthDate.toISOString().split('T')[0],
      birthTime: order.birthTime ?? undefined,
      city: order.city,
      birthCity: order.birthCity ?? undefined,
      request: order.request || undefined,
    })

    console.log('[STRIPE] checkout.session.completed processed', orderId)
  } catch (error) {
    console.error('[STRIPE] Webhook handler error:', error)
  }

  return NextResponse.json({ received: true })
}
