import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Маска телефона: +7 (XXX) XXX-XX-XX (Россия, Казахстан) */
export function formatPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length === 0) return ''
  const normalized = digits.startsWith('8') ? '7' + digits.slice(1) : digits.startsWith('7') ? digits : '7' + digits
  return formatPhoneDigits(normalized)
}

function formatPhoneDigits(digits: string): string {
  if (digits.length <= 1) return digits ? `+7` : ''
  const d = digits.slice(1, 11) // 10 цифр после 7
  let result = '+7'
  if (d.length > 0) result += ` (${d.slice(0, 3)}`
  if (d.length > 3) result += `) ${d.slice(3, 6)}`
  if (d.length > 6) result += `-${d.slice(6, 8)}`
  if (d.length > 8) result += `-${d.slice(8, 10)}`
  return result
}

/** Проверка валидности номера: 10 цифр после +7 */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  const normalized = digits.startsWith('8') ? '7' + digits.slice(1) : digits.startsWith('7') ? digits : '7' + digits
  return normalized.length === 11 && normalized.startsWith('7')
}

export function getUTMParams(): Record<string, string | null> {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content'),
  }
}

/** Цель Яндекс.Метрики (для методички 7777 ₸ — отдельная настройка рекламы) */
export function reachMetrikaGoal(goalName: string, params?: Record<string, string | number>) {
  if (typeof window === 'undefined') return
  const w = window as { ym?: (id: number, a: string, ...args: unknown[]) => void }
  if (!w.ym) return
  const id = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
  if (!id) return
  const numId = parseInt(id, 10)
  if (isNaN(numId)) return
  if (params) w.ym(numId, 'reachGoal', goalName, params)
  else w.ym(numId, 'reachGoal', goalName)
}
