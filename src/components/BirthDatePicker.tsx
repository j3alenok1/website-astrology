'use client'

import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { ru } from 'date-fns/locale'
import { format, parse, isValid } from 'date-fns'
import { Calendar } from 'lucide-react'
import 'react-datepicker/dist/react-datepicker.css'

interface BirthDatePickerProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  placeholder?: string
}

function parseInputToDate(s: string): Date | null {
  const cleaned = s.replace(/\s/g, '').replace(/[./-]/g, '.')
  const match = cleaned.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
  if (!match) return null
  const [, d, m, y] = match
  const day = parseInt(d, 10)
  const month = parseInt(m, 10) - 1
  const year = parseInt(y, 10)
  if (year < 1900 || year > new Date().getFullYear()) return null
  if (month < 0 || month > 11) return null
  if (day < 1 || day > 31) return null
  const date = new Date(year, month, day)
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return date <= today ? date : null
}

export function BirthDatePicker({ value, onChange, onBlur, error, placeholder = 'ДД.ММ.ГГГГ' }: BirthDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState<string | null>(null)

  useEffect(() => {
    if (value) {
      try {
        const parsed = parse(value, 'yyyy-MM-dd', new Date())
        if (isValid(parsed)) setInputValue(null)
      } catch {
        setInputValue(null)
      }
    } else {
      setInputValue(null)
    }
  }, [value])

  let dateValue: Date | null = null
  if (value) {
    try {
      const parsed = parse(value, 'yyyy-MM-dd', new Date())
      dateValue = isValid(parsed) ? parsed : null
    } catch {
      dateValue = null
    }
  }

  const displayValue = inputValue !== null ? inputValue : (dateValue ? format(dateValue, 'dd.MM.yyyy') : '')

  const handleChange = (date: Date | null) => {
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'))
      setInputValue(null)
    }
  }

  const handleSelect = (date: Date | null) => {
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'))
      setInputValue(null)
      setIsOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setInputValue(v)
    const parsed = parseInputToDate(v)
    if (parsed) {
      onChange(format(parsed, 'yyyy-MM-dd'))
    } else if (v.length === 0) {
      onChange('')
    }
  }

  const handleInputBlur = () => {
    onBlur?.()
    const v = inputValue ?? ''
    if (v && !parseInputToDate(v)) {
      setInputValue(null)
    } else {
      setInputValue(null)
    }
  }

  return (
    <div className="relative">
      <div className="form-input flex items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-white placeholder-gray-400"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Открыть календарь"
        >
          <Calendar className="w-5 h-5 text-purple-400" />
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 right-0 mt-1 z-50 rounded-xl overflow-hidden bg-slate-800/95 border border-white/20 shadow-2xl min-w-[280px] sm:min-w-[320px]">
            <DatePicker
              selected={dateValue}
              onChange={handleChange}
              onSelect={handleSelect}
              inline
              locale={ru}
              maxDate={new Date()}
              minDate={new Date(1900, 0, 1)}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              yearDropdownItemNumber={80}
              scrollableYearDropdown
              className="!border-0 !bg-transparent"
              calendarClassName="birth-date-calendar"
            />
          </div>
        </>
      )}

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  )
}
