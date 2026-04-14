/** Упоминание в тексте уведомления (канал / подписчик). */
const NOTIFY_MENTION = '@whitewidowz'

export type TelegramLeadPayload = {
  name: string
  contact: string
  productTitle?: string | null
  request?: string | null
}

type TelegramSendResponse = {
  ok?: boolean
  description?: string
  error_code?: number
  result?: { message_id?: number }
}

/**
 * Для личного чата API часто не принимает @username — нужен числовой `message.chat.id`
 * из ответа getUpdates после /start. Каналы: `@имя_канала` или `-100…`.
 */
function normalizeTelegramChatId(raw: string): string | number {
  const s = raw.trim()
  if (/^-?\d+$/.test(s)) {
    const n = Number(s)
    if (Number.isSafeInteger(n)) return n
  }
  return s
}

/**
 * Дублирует заявку в Telegram (бот → канал или чат).
 * Нужны TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в env.
 */
export async function sendTelegramLeadNotification(lead: TelegramLeadPayload): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim()
  if (!token || !chatId) {
    console.warn(
      '[LEADS] Telegram: пропуск — задайте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в Vercel и сделайте Redeploy.'
    )
    return
  }

  const lines = [
    `У вас новая заявка с сайта! ${NOTIFY_MENTION}`,
    '',
    `👤 ${lead.name}`,
    `📞 ${lead.contact}`,
  ]
  if (lead.productTitle) lines.push(`📦 ${lead.productTitle}`)
  if (lead.request?.trim()) {
    const r = lead.request.trim()
    lines.push(`💬 ${r.length > 800 ? `${r.slice(0, 800)}…` : r}`)
  }

  const text = lines.join('\n').slice(0, 4096)
  const chatIdResolved = normalizeTelegramChatId(chatId)

  const url = `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatIdResolved,
        text,
        disable_web_page_preview: true,
      }),
    })

    const raw = await res.text()
    let data: TelegramSendResponse = {}
    try {
      data = JSON.parse(raw) as TelegramSendResponse
    } catch {
      console.error('[LEADS] Telegram: не JSON в ответе', res.status, raw.slice(0, 500))
      return
    }

    // У Telegram часто HTTP 200, но в теле ok: false (например chat not found)
    if (!data.ok) {
      const isChatNotFound =
        data.description?.toLowerCase().includes('chat not found') ||
        data.description?.toLowerCase().includes('user not found')
      console.error(
        '[LEADS] Telegram API:',
        data.error_code,
        data.description,
        '| env TELEGRAM_CHAT_ID:',
        chatId,
        isChatNotFound && chatId.startsWith('@')
          ? '| Личка: в Vercel укажите числовой chat_id из getUpdates (см. docs/VERCEL_ENV.md), не @username.'
          : '| Личка: /start боту; канал: бот — админ. Почта: проверьте SMTP_TO в Vercel.'
      )
      return
    }

    console.log(
      '[LEADS] Telegram: сообщение отправлено, message_id=',
      data.result?.message_id,
      'chat:',
      chatIdResolved
    )
  } catch (e) {
    console.error('[LEADS] Telegram fetch:', e)
  }
}
