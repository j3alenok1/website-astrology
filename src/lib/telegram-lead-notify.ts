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

/** Убирает кавычки и лишние символы из значения env (часто копируют с кавычками). */
export function sanitizeTelegramChatIdEnv(raw: string): string {
  return raw
    .replace(/^\uFEFF/, '')
    .trim()
    .replace(/^['"`]|['"`]$/g, '')
    .trim()
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

async function postSendMessage(
  token: string,
  chatIdResolved: string | number,
  text: string
): Promise<{ ok: boolean; data?: TelegramSendResponse; httpStatus: number; rawSnippet: string }> {
  const url = `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatIdResolved,
      text,
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(20_000),
  })

  const raw = await res.text()
  let data: TelegramSendResponse = {}
  try {
    data = JSON.parse(raw) as TelegramSendResponse
  } catch {
    return { ok: false, httpStatus: res.status, rawSnippet: raw.slice(0, 500) }
  }

  return { ok: !!data.ok, data, httpStatus: res.status, rawSnippet: raw.slice(0, 300) }
}

export type TelegramNotifyResult =
  | { ok: true; messageId?: number }
  | { ok: false; skipped: true; reason: 'missing_env' }
  | { ok: false; error: string; telegramDescription?: string; chatIdUsed?: string | number }

/**
 * Дублирует заявку в Telegram (бот → канал или чат).
 * Нужны TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в env.
 */
export async function sendTelegramLeadNotification(lead: TelegramLeadPayload): Promise<TelegramNotifyResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const chatIdRaw = process.env.TELEGRAM_CHAT_ID
  const chatIdClean = chatIdRaw ? sanitizeTelegramChatIdEnv(chatIdRaw) : ''

  if (!token || !chatIdClean) {
    console.warn(
      '[LEADS] Telegram: пропуск — задайте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в Vercel и сделайте Redeploy.'
    )
    return { ok: false, skipped: true, reason: 'missing_env' }
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
  const chatIdResolved = normalizeTelegramChatId(chatIdClean)

  console.log('[LEADS] Telegram: отправка, chat_id=', chatIdResolved, typeof chatIdResolved === 'number' ? '(number)' : '(string)')

  try {
    const result = await postSendMessage(token, chatIdResolved, text)

    if (!result.data) {
      console.error('[LEADS] Telegram: не JSON, http=', result.httpStatus, result.rawSnippet)
      return { ok: false, error: 'invalid_response', telegramDescription: result.rawSnippet, chatIdUsed: chatIdResolved }
    }

    if (!result.ok || !result.data.ok) {
      const d = result.data
      const isChatNotFound =
        d.description?.toLowerCase().includes('chat not found') ||
        d.description?.toLowerCase().includes('user not found')
      // В description у Telegram бывает разный символ апострофа в "can't" — матчим по хвосту фразы
      const isBotToBot = /send messages to bots/i.test(d.description ?? '')

      console.error(
        '[LEADS] Telegram API:',
        d.error_code,
        d.description,
        '| env (до очистки):',
        chatIdRaw,
        '| chat_id в запросе:',
        chatIdResolved,
        isBotToBot
          ? '| ВАЖНО: этот chat_id — другой БОТ. Нужен id ЧЕЛОВЕКА: откройте Telegram с личного аккаунта → напишите ВАШЕМУ боту /start → getUpdates → поле message.chat.id (не id бота из сторонних ботов).'
          : isChatNotFound && String(chatIdClean).startsWith('@')
            ? '| Личка: числовой id из getUpdates, не @username (docs/VERCEL_ENV.md).'
            : '| Проверьте /start этим аккаунтом у этого бота; для канала — бот админ.'
      )

      return {
        ok: false,
        error: d.description || 'send_failed',
        telegramDescription: d.description,
        chatIdUsed: chatIdResolved,
      }
    }

    const mid = result.data.result?.message_id
    console.log('[LEADS] Telegram: сообщение отправлено, message_id=', mid, 'chat:', chatIdResolved)
    return { ok: true, messageId: mid }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[LEADS] Telegram fetch:', msg, e)
    return { ok: false, error: msg }
  }
}

/**
 * Тестовое сообщение (тот же токен и chat_id). Для ручной проверки с /api/telegram/test.
 */
export async function sendTelegramPingMessage(): Promise<TelegramNotifyResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const chatIdRaw = process.env.TELEGRAM_CHAT_ID
  const chatIdClean = chatIdRaw ? sanitizeTelegramChatIdEnv(chatIdRaw) : ''

  if (!token || !chatIdClean) {
    return { ok: false, skipped: true, reason: 'missing_env' }
  }

  const chatIdResolved = normalizeTelegramChatId(chatIdClean)
  try {
    const result = await postSendMessage(
      token,
      chatIdResolved,
      'Тест: бот доставляет сообщения. Если видите это — TELEGRAM_CHAT_ID верный.'
    )

    if (!result.data) {
      return { ok: false, error: 'invalid_response', telegramDescription: result.rawSnippet, chatIdUsed: chatIdResolved }
    }
    if (!result.ok || !result.data.ok) {
      return {
        ok: false,
        error: result.data.description || 'send_failed',
        telegramDescription: result.data.description,
        chatIdUsed: chatIdResolved,
      }
    }
    return { ok: true, messageId: result.data.result?.message_id }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, error: msg }
  }
}

/** Проверка токена бота (без отправки в чат). */
export async function telegramGetMe(): Promise<{ ok: boolean; username?: string; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  if (!token) return { ok: false, error: 'no token' }
  try {
    const res = await fetch(`https://api.telegram.org/bot${encodeURIComponent(token)}/getMe`, {
      signal: AbortSignal.timeout(10_000),
    })
    const data = (await res.json()) as { ok?: boolean; result?: { username?: string }; description?: string }
    if (!data.ok || !data.result?.username) {
      return { ok: false, error: data.description || 'getMe failed' }
    }
    return { ok: true, username: data.result.username }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}
