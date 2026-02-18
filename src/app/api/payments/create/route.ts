import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

function isValidBirthDate(val: string): boolean {
  if (!val) return false
  const match = val.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return false
  const [, year, month, day] = match
  const yearNum = parseInt(year, 10)
  const monthNum = parseInt(month, 10)
  const dayNum = parseInt(day, 10)
  if (yearNum < 1900 || yearNum > new Date().getFullYear()) return false
  if (monthNum < 1 || monthNum > 12) return false
  const d = new Date(val)
  if (isNaN(d.getTime())) return false
  if (d.getFullYear() !== yearNum || d.getMonth() + 1 !== monthNum || d.getDate() !== dayNum) return false
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return d <= today
}

const createPaymentSchema = z.object({
  productSlug: z.string().min(1),
  productTitle: z.string().min(1),
  amount: z.number().int().positive(), // в тиынах
  name: z.string().min(2),
  birthDate: z.string().min(1).refine(isValidBirthDate, 'Некорректная дата рождения'),
  birthTime: z.string().optional(),
  city: z.string().min(2),
  birthCity: z.string().min(2).optional(),
  contact: z.string().min(5),
  request: z.string().max(1500).optional(),
  consent: z.boolean().refine((v) => v === true),
  utmSource: z.string().nullable().optional(),
  utmMedium: z.string().nullable().optional(),
  utmCampaign: z.string().nullable().optional(),
  utmTerm: z.string().nullable().optional(),
  utmContent: z.string().nullable().optional(),
})

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown'
}

export async function POST(req: NextRequest) {
  try {
    const shopId = process.env.YOOKASSA_SHOP_ID
    const secretKey = process.env.YOOKASSA_SECRET_KEY

    if (!shopId || !secretKey) {
      return NextResponse.json(
        { error: 'Платёжная система не настроена' },
        { status: 500 }
      )
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'База данных не настроена' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const data = createPaymentSchema.parse(body)

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://astrobyndauzh.com'
    const returnUrl = `${baseUrl}/payment/success`
    const amountValue = (data.amount / 100).toFixed(2) // тиыны → тенге

    const order = await prisma.order.create({
      data: {
        productSlug: data.productSlug,
        productTitle: data.productTitle,
        amount: data.amount,
        currency: 'KZT',
        name: data.name,
        birthDate: new Date(data.birthDate),
        birthTime: data.birthTime,
        city: data.city,
        birthCity: data.birthCity,
        contact: data.contact,
        request: data.request ?? '',
        consent: data.consent,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        utmTerm: data.utmTerm,
        utmContent: data.utmContent,
        paymentProvider: 'yookassa',
        userAgent: req.headers.get('user-agent') ?? undefined,
        referrer: req.headers.get('referer') ?? undefined,
        ipAddress: getClientIp(req),
      },
    })

    const yookassaBody = {
      amount: {
        value: amountValue,
        currency: 'KZT',
      },
      confirmation: {
        type: 'redirect' as const,
        return_url: `${returnUrl}?orderId=${order.id}`,
      },
      capture: true,
      description: `${data.productTitle} — ${data.name}`,
      metadata: {
        orderId: order.id,
      },
    }

    const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64')
    const yookassaRes = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': order.id,
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(yookassaBody),
    })

    if (!yookassaRes.ok) {
      const errText = await yookassaRes.text()
      console.error('[PAYMENTS] YooKassa error:', yookassaRes.status, errText)
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'failed' },
      })
      return NextResponse.json(
        { error: 'Ошибка создания платежа. Попробуйте позже.' },
        { status: 502 }
      )
    }

    const payment = await yookassaRes.json()
    const confirmationUrl = payment.confirmation?.confirmation_url

    if (!confirmationUrl) {
      return NextResponse.json(
        { error: 'Не получена ссылка на оплату' },
        { status: 502 }
      )
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { yookassaPaymentId: payment.id },
    })

    return NextResponse.json({
      success: true,
      paymentUrl: confirmationUrl,
      orderId: order.id,
    })
  } catch (error) {
    console.error('[PAYMENTS] Create error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
