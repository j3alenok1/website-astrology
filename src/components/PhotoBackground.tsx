'use client'

export function PhotoBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 photo-bg-layer" aria-hidden>
      <div
        className="absolute inset-0 photo-bg-image"
        style={{
          backgroundImage: 'url(/6.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 5%',
        }}
      />
      <div className="absolute inset-0 photo-bg-overlay-v2" />
    </div>
  )
}
