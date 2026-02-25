'use client'

import { useState } from 'react'
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

export function BirthDatePicker({ value, onChange, onBlur, error, placeholder = 'Выберите дату' }: BirthDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  let dateValue: Date | null = null
  if (value) {
    try {
      const parsed = parse(value, 'yyyy-MM-dd', new Date())
      dateValue = isValid(parsed) ? parsed : null
    } catch {
      dateValue = null
    }
  }

  const displayValue = dateValue ? format(dateValue, 'dd.MM.yyyy') : value || ''

  const handleChange = (date: Date | null) => {
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'))
    }
  }

  const handleSelect = (date: Date | null) => {
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'))
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={onBlur}
        className="form-input flex items-center justify-between gap-2 text-left cursor-pointer"
      >
        <span className={displayValue ? 'text-white' : 'text-gray-400'}>{displayValue || placeholder}</span>
        <Calendar className="w-5 h-5 text-purple-400 shrink-0" />
      </button>

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
