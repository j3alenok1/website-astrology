import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramPingMessage, telegramGetMe } from '@/lib/telegram-lead-notify'

/**
 * Проверка Telegram без отправки формы.
 * POST с заголовком x-telegram-test-secret: <TELEGRAM_TEST_SECRET из Vercel>
 *
 * Временно задайте TELEGRAM_TEST_SECRET (длинная случайная строка), redeploy,
 * вызовите curl/postman, затем удалите секрет.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_TEST_SECRET?.trim()
  if (!secret || req.headers.get('x-telegram-test-secret') !== secret) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const me = await telegramGetMe()
  const ping = await sendTelegramPingMessage()

  return NextResponse.json({
    getMe: me,
    ping,
    note: ping.ok
      ? 'Сообщение «Тест: бот доставляет…» должно прийти в чат с ботом.'
      : 'Смотрите ping.telegramDescription или error; проверьте TELEGRAM_CHAT_ID и что вы писали /start этому боту.',
  })
}

export const dynamic = 'force-dynamic'
