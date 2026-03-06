import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

function verifyWebhookSignature(payload: string | Buffer, signature: string, secret: string): boolean {
  const data = typeof payload === 'string' ? Buffer.from(payload, 'utf8') : payload
  const sig = (signature || '').trim()

  const tryVerify = (key: string | Buffer) => {
    const computedHex = crypto.createHmac('sha256', key).update(data).digest('hex')
    const expectedWithPrefix = 'sha256=' + computedHex
    if (sig === expectedWithPrefix) return true
    if (sig === computedHex) return true
    const sigWithoutPrefix = sig.startsWith('sha256=') ? sig.slice(7) : sig
    if (sigWithoutPrefix === computedHex) return true
    return false
  }

  if (tryVerify(secret)) return true
  if (secret.length === 64 && /^[a-fA-F0-9]+$/.test(secret)) {
    if (tryVerify(Buffer.from(secret, 'hex'))) return true
  }
  return false
}

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
      subject: `💰 Kaspi Pay: Оплачено — ${leadData.productTitle} — ${leadData.name}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; padding: 20px;">
  <h2 style="color: #e31e24;">💰 Оплата Kaspi Pay получена</h2>
  <p><strong>Статус оплаты:</strong> <span style="color: #22c55e; font-weight: 700;">Оплачено</span></p>
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
    console.error('[KASPI] Email error:', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const secret = (process.env.APIPAY_WEBHOOK_SECRET || '').trim()
    if (!secret) {
      console.error('[KASPI] APIPAY_WEBHOOK_SECRET not set')
      return NextResponse.json({ received: true })
    }

    const rawBuffer = await req.arrayBuffer()
    const rawBody = new TextDecoder('utf-8').decode(rawBuffer)
    const signature = (req.headers.get('x-webhook-signature') || req.headers.get('X-Webhook-Signature') || '').trim()

    const skipVerify = process.env.APIPAY_SKIP_WEBHOOK_VERIFY === 'true'
    if (signature.length === 0) {
      console.error('[KASPI] Webhook signature is EMPTY - ApiPay не отправляет X-Webhook-Signature. Настройте подпись в ApiPay (Создать подпись).')
      if (!skipVerify) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    } else if (!skipVerify) {
      let verified = verifyWebhookSignature(rawBody, signature, secret)
      if (!verified) {
        try {
          const body = JSON.parse(rawBody)
          const canonicalBody = JSON.stringify(body)
          if (canonicalBody !== rawBody) {
            verified = verifyWebhookSignature(canonicalBody, signature, secret)
          }
        } catch {
          // keep verified false
        }
      }
      if (!verified) {
        console.error('[KASPI] Invalid webhook signature', { bodyLen: rawBody.length, sigLen: signature.length })
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const body = JSON.parse(rawBody)

    if (body.event !== 'invoice.status_changed') {
      return NextResponse.json({ received: true })
    }

    const invoice = body.invoice
    const orderId = invoice.external_order_id
    if (!orderId) {
      console.error('[KASPI] Webhook: no external_order_id')
      return NextResponse.json({ received: true })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      console.error('[KASPI] Webhook: order not found', orderId)
      return NextResponse.json({ received: true })
    }

    // ApiPay: pending, paid, cancelled, expired, partially_refunded, refunded
    const isRefund = ['refunded', 'partially_refunded', 'refund', 'cancelled', 'canceled'].includes(
      String(invoice.status || '').toLowerCase()
    )

    if (isRefund) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'refunded' },
      })
      await prisma.lead.updateMany({
        where: { orderId: order.id },
        data: { paymentStatus: 'refunded' },
      })
      console.log('[KASPI] Refund processed for order', orderId)
      return NextResponse.json({ received: true })
    }

    if (invoice.status !== 'paid') {
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

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[KASPI] Webhook error:', error)
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
