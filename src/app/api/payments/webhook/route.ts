import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

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
      subject: `💰 Оплачено: ${leadData.productTitle} — ${leadData.name}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; padding: 20px;">
  <h2 style="color: #7c3aed;">💰 Оплата получена</h2>
  <p><strong>Продукт:</strong> ${leadData.productTitle}</p>
  <p><strong>Сумма:</strong> ${amountFormatted} ₸</p>
  <p><strong>Клиент:</strong> ${leadData.name}</p>
  <p><strong>Контакты:</strong> ${leadData.contact}</p>
  <p><strong>Город:</strong> ${leadData.city}</p>
  ${leadData.birthCity ? `<p><strong>Город рождения:</strong> ${leadData.birthCity}</p>` : ''}
  <p><strong>Дата рождения:</strong> ${leadData.birthDate}${leadData.birthTime ? ` ${leadData.birthTime}` : ''}</p>
  ${leadData.request ? `<p><strong>Запрос:</strong><br>${leadData.request.replace(/\n/g, '<br>')}</p>` : ''}
  <p style="color: #666; font-size: 12px;">${new Date().toLocaleString('ru-RU')}</p>
</body>
</html>
      `,
    })
  } catch (err) {
    console.error('[PAYMENTS] Email error:', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.event !== 'payment.succeeded') {
      return NextResponse.json({ received: true })
    }

    const payment = body.object
    const paymentId = payment.id
    const orderId = payment.metadata?.orderId

    if (!orderId) {
      console.error('[PAYMENTS] Webhook: no orderId in metadata')
      return NextResponse.json({ received: true })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      console.error('[PAYMENTS] Webhook: order not found', orderId)
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

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[PAYMENTS] Webhook error:', error)
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
