import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const DIGITAL_PRODUCTS = ['astrologiya-otnosheniy']

const schema = z.object({
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

/** Опционально: редирект на Payment Link с client_reference_id (альтернатива Buy Button) */
function getStripePaymentLink(): string | undefined {
  return (
    process.env.STRIPE_PAYMENT_LINK?.trim() ||
    process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK?.trim()
  )
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'База данных не настроена (DATABASE_URL).' },
        { status: 503 }
      )
    }

    const body = await req.json()
    const data = schema.parse(body)

    if (!DIGITAL_PRODUCTS.includes(data.productSlug)) {
      return NextResponse.json(
        { error: 'Данный продукт не поддерживает оплату через эту форму' },
        { status: 400 }
      )
    }

    const disableRecaptcha = process.env.DISABLE_RECAPTCHA === 'true'
    if (!disableRecaptcha) {
      if (!data.recaptchaToken) {
        return NextResponse.json({ error: 'Требуется проверка reCAPTCHA' }, { status: 400 })
      }
      if (process.env.RECAPTCHA_SECRET_KEY) {
        const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${data.recaptchaToken}`,
        })
        const recaptchaData = await recaptchaRes.json()
        if (!recaptchaData.success) {
          return NextResponse.json({ error: 'Ошибка проверки reCAPTCHA' }, { status: 400 })
        }
      }
    }

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
        paymentProvider: 'stripe',
        userAgent: req.headers.get('user-agent') ?? undefined,
        referrer: req.headers.get('referer') ?? undefined,
        ipAddress: getClientIp(req),
      },
    })

    const paymentLink = getStripePaymentLink()
    const paymentUrl = paymentLink
      ? `${paymentLink}${paymentLink.includes('?') ? '&' : '?'}client_reference_id=${encodeURIComponent(order.id)}`
      : undefined

    return NextResponse.json({
      success: true,
      orderId: order.id,
      provider: 'stripe',
      ...(paymentUrl ? { paymentUrl } : {}),
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[STRIPE] prepare-digital error:', msg, error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ошибка валидации', details: error.errors }, { status: 400 })
    }
    if (msg.includes('Prisma') || msg.includes('database') || msg.includes('connect')) {
      return NextResponse.json(
        { error: 'Ошибка базы данных. Проверьте DATABASE_URL в Vercel.' },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера', debug: process.env.NODE_ENV === 'development' ? msg : undefined },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
