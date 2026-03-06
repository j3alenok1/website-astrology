import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const DIGITAL_PRODUCTS = ['astrologiya-otnosheniy']

/** Конвертация +7 (999) 999-99-99 → 87001234567 для ApiPay/Kaspi */
function toKaspiPhone(contact: string): string {
  const digits = contact.replace(/\D/g, '')
  if (digits.length < 10) return ''
  const ten = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1, 11) : digits.slice(0, 10)
  return '8' + ten.padStart(10, '0').slice(-10)
}

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
    const data = createDigitalSchema.parse(body)

    if (!DIGITAL_PRODUCTS.includes(data.productSlug)) {
      return NextResponse.json(
        { error: 'Данный продукт не поддерживает оплату через Kaspi' },
        { status: 400 }
      )
    }

    const kaspiPhone = toKaspiPhone(data.contact)
    if (!kaspiPhone || kaspiPhone.length !== 11) {
      return NextResponse.json(
        { error: 'Укажите корректный номер телефона для Kaspi (формат: +7 XXX XXX XX XX)' },
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
      console.error('[KASPI] ApiPay digital error:', apipayRes.status, errText)
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
    const successUrl = `${baseUrl}/payment/success?orderId=${order.id}&provider=kaspi&product=${data.productSlug}`

    return NextResponse.json({
      success: true,
      provider: 'kaspi',
      orderId: order.id,
      message: 'Счёт отправлен в приложение Kaspi.kz. Оплатите в приложении — после оплаты календарь будет доступен для скачивания.',
      successUrl,
    })
  } catch (error) {
    console.error('[KASPI] Create digital error:', error)

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
