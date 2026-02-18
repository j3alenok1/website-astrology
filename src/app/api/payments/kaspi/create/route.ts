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

/** Конвертация +7 (999) 999-99-99 → 87001234567 для ApiPay/Kaspi */
function toKaspiPhone(contact: string): string {
  const digits = contact.replace(/\D/g, '')
  if (digits.length < 10) return ''
  const ten = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1, 11) : digits.slice(0, 10)
  return '8' + ten.padStart(10, '0').slice(-10)
}

const createSchema = z.object({
  productSlug: z.string().min(1),
  productTitle: z.string().min(1),
  amount: z.number().int().positive(),
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

const ALMATY_VARIANTS = ['алматы', 'almaty', 'алма-ата', 'alma-ata']

function isAlmaty(city: string): boolean {
  const normalized = city.trim().toLowerCase()
  return ALMATY_VARIANTS.some((v) => normalized.includes(v) || normalized === v)
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.APIPAY_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Kaspi Pay не настроен' },
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
    const data = createSchema.parse(body)

    if (!isAlmaty(data.city)) {
      return NextResponse.json(
        { error: 'Оплата Kaspi Pay доступна только для клиентов из Алматы' },
        { status: 400 }
      )
    }

    const kaspiPhone = toKaspiPhone(data.contact)
    if (!kaspiPhone || kaspiPhone.length !== 11) {
      return NextResponse.json(
        { error: 'Укажите корректный номер телефона для Kaspi Pay (формат: 8 XXX XXX XX XX)' },
        { status: 400 }
      )
    }

    const order = await prisma.order.create({
      data: {
        productSlug: data.productSlug,
        productTitle: data.productTitle,
        amount: data.amount,
        currency: 'KZT',
        paymentProvider: 'kaspi',
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
        userAgent: req.headers.get('user-agent') ?? undefined,
        referrer: req.headers.get('referer') ?? undefined,
        ipAddress: getClientIp(req),
      },
    })

    const amountTenge = (data.amount / 100).toFixed(2)

    const apipayRes = await fetch('https://bpapi.bazarbay.site/api/v1/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        amount: parseFloat(amountTenge),
        phone_number: kaspiPhone,
        description: `${data.productTitle} — ${data.name}`,
        external_order_id: order.id,
      }),
    })

    if (!apipayRes.ok) {
      const errText = await apipayRes.text()
      console.error('[KASPI] ApiPay error:', apipayRes.status, errText)
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'failed' },
      })
      return NextResponse.json(
        { error: 'Ошибка создания счёта Kaspi Pay. Попробуйте позже.' },
        { status: 502 }
      )
    }

    const invoice = await apipayRes.json()

    await prisma.order.update({
      where: { id: order.id },
      data: { apipayInvoiceId: invoice.id },
    })

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://astrobyndauzh.com'

    return NextResponse.json({
      success: true,
      provider: 'kaspi',
      orderId: order.id,
      message: 'Счёт отправлен в приложение Kaspi.kz на ваш номер телефона. Оплатите в приложении.',
      successUrl: `${baseUrl}/payment/success?orderId=${order.id}&provider=kaspi`,
    })
  } catch (error) {
    console.error('[KASPI] Create error:', error)

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
