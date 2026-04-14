/** Упоминание в тексте уведомления (канал / подписчик). */
const NOTIFY_MENTION = '@whitewidowz'

export type TelegramLeadPayload = {
  name: string
  contact: string
  productTitle?: string | null
  request?: string | null
}

/**
 * Дублирует заявку в Telegram (бот → канал или чат).
 * Нужны TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в env.
 */
export async function sendTelegramLeadNotification(lead: TelegramLeadPayload): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim()
  if (!token || !chatId) return

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

  const url = `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    })
    if (!res.ok) {
      const errBody = await res.text()
      console.error('[LEADS] Telegram API:', res.status, errBody)
    }
  } catch (e) {
    console.error('[LEADS] Telegram:', e)
  }
}
