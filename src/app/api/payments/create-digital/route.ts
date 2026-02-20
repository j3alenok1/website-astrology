import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const DIGITAL_PRODUCTS = ['astrologiya-otnosheniy']

const createDigitalSchema = z.object({
  productSlug: z.string().min(1),
  productTitle: z.string().min(1),
  amount: z.number().int().positive(),
  name: z.string().min(2),
  contact: z.string().min(5),
  consent: z.boolean().refine((v) => v === true),
  utmSource: z.string().nullable().optional(),
  utmMedium: z.string().nullable().optional(),
  utmCampaign: z.string().nullable().optional(),
  utmTerm: z.string().nullable().optional(),
  utmContent: z.string().nullable().optional(),
  recaptchaToken: z.string().optional(),
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
    const data = createDigitalSchema.parse(body)

    if (!DIGITAL_PRODUCTS.includes(data.productSlug)) {
      return NextResponse.json(
        { error: 'Данный продукт не поддерживает оплату через эту форму' },
        { status: 400 }
      )
    }

    const disableRecaptcha = process.env.DISABLE_RECAPTCHA === 'true'
    if (!disableRecaptcha) {
      if (!data.recaptchaToken) {
        return NextResponse.json(
          { error: 'Требуется проверка reCAPTCHA' },
          { status: 400 }
        )
      }
      if (process.env.RECAPTCHA_SECRET_KEY) {
        const recaptchaRes = await fetch(
          'https://www.google.com/recaptcha/api/siteverify',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${data.recaptchaToken}`,
          }
        )
        const recaptchaData = await recaptchaRes.json()
        if (!recaptchaData.success) {
          return NextResponse.json(
            { error: 'Ошибка проверки reCAPTCHA' },
            { status: 400 }
          )
        }
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://astrobyndauzh.com'
    const returnUrl = `${baseUrl}/payment/success?orderId=ORDER_ID&product=${data.productSlug}`

    const order = await prisma.order.create({
      data: {
        productSlug: data.productSlug,
        productTitle: data.productTitle,
        amount: data.amount,
        currency: 'KZT',
        name: data.name,
        birthDate: new Date('2000-01-01'),
        birthTime: null,
        city: 'Цифровой продукт',
        birthCity: '—',
        contact: data.contact,
        request: '',
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

    const finalReturnUrl = returnUrl.replace('ORDER_ID', order.id)
    const amountValue = (data.amount / 100).toFixed(2)

    const yookassaBody = {
      amount: {
        value: amountValue,
        currency: 'KZT',
      },
      confirmation: {
        type: 'redirect' as const,
        return_url: finalReturnUrl,
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
      console.error('[PAYMENTS] YooKassa digital error:', yookassaRes.status, errText)
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
    console.error('[PAYMENTS] Create digital error:', error)

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
