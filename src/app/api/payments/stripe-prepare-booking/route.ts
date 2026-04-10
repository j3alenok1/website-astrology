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

const schema = z.object({
  productSlug: z.string().min(1),
  productTitle: z.string().min(1),
  amount: z.number().int().positive(),
  name: z.string().min(2),
  birthDate: z.string().min(1).refine(isValidBirthDate, 'Некорректная дата рождения'),
  birthTime: z.string().optional(),
  city: z.string().min(2),
  birthCity: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : v),
    z.string().min(2).optional()
  ),
  contact: z.string().min(5),
  request: z.string().max(1500).optional(),
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

/**
 * Консультации: заказ в БД → редирект на Stripe Payment Link с client_reference_id.
 * Ссылка: NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BOOKING или та же NEXT_PUBLIC_STRIPE_PAYMENT_LINK (одна ссылка на всех — только если цена в Stripe совпадает).
 */
export async function POST(req: NextRequest) {
  try {
    const paymentLink =
      process.env.STRIPE_PAYMENT_LINK_BOOKING?.trim() ||
      process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BOOKING?.trim() ||
      process.env.STRIPE_PAYMENT_LINK?.trim() ||
      process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK?.trim()
    if (!paymentLink) {
      console.error('[STRIPE] Нет ссылки для booking: STRIPE_PAYMENT_LINK_BOOKING / STRIPE_PAYMENT_LINK / …')
      return NextResponse.json(
        {
          error:
            'Не задан Stripe Payment Link. Добавьте STRIPE_PAYMENT_LINK или NEXT_PUBLIC_STRIPE_PAYMENT_LINK в Vercel.',
        },
        { status: 503 }
      )
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Сервис временно недоступен.' }, { status: 503 })
    }

    const body = await req.json()
    const data = schema.parse(body)

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
        paymentProvider: 'stripe',
        userAgent: req.headers.get('user-agent') ?? undefined,
        referrer: req.headers.get('referer') ?? undefined,
        ipAddress: getClientIp(req),
      },
    })

    const sep = paymentLink.includes('?') ? '&' : '?'
    const paymentUrl = `${paymentLink}${sep}client_reference_id=${encodeURIComponent(order.id)}`

    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId: order.id,
      provider: 'stripe',
    })
  } catch (error) {
    console.error('[STRIPE] prepare-booking error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ошибка валидации', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
