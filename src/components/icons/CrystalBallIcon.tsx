import type { LucideProps } from 'lucide-react'

export function CrystalBallIcon({ className, size = 32, ...props }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Шар для гаданий — стеклянная сфера */}
      <circle cx="16" cy="10" r="7.5" />
      {/* Блик на стекле (отражение света) */}
      <ellipse cx="12.5" cy="7.5" rx="2" ry="2.5" fill="currentColor" fillOpacity="0.35" stroke="none" />
      {/* Искра внутри шара */}
      <line x1="16" y1="9" x2="16" y2="13" strokeWidth="1" />
      <line x1="14" y1="11" x2="18" y2="11" strokeWidth="1" />
      {/* Пьедестал */}
      <path d="M11 17.5 Q16 22 21 17.5" />
    </svg>
  )
}
