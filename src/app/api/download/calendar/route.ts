import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import path from 'path'
import fs from 'fs'

const DIGITAL_PRODUCT_SLUG = 'astrologiya-otnosheniy'
const FILE_NAME = 'relationship-calendar.pdf'

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get('orderId')
    if (!orderId) {
      return NextResponse.json(
        { error: 'Укажите номер заказа' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Заказ не найден' },
        { status: 404 }
      )
    }

    if (order.productSlug !== DIGITAL_PRODUCT_SLUG) {
      return NextResponse.json(
        { error: 'Этот заказ не даёт доступ к календарю' },
        { status: 403 }
      )
    }

    if (order.status !== 'paid') {
      return NextResponse.json(
        { error: 'Оплата ещё не получена. Подождите несколько секунд и обновите страницу.' },
        { status: 402 }
      )
    }

    const filePath = path.join(process.cwd(), 'public', 'downloads', FILE_NAME)

    if (!fs.existsSync(filePath)) {
      console.error('[DOWNLOAD] File not found:', filePath)
      return NextResponse.json(
        { error: 'Файл временно недоступен. Свяжитесь с нами.' },
        { status: 404 }
      )
    }

    const fileBuffer = fs.readFileSync(filePath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${FILE_NAME}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('[DOWNLOAD] Error:', error)
    return NextResponse.json(
      { error: 'Ошибка при скачивании' },
      { status: 500 }
    )
  }
}
