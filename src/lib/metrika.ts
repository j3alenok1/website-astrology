const METRIKA_ID = 106988269

export function reachGoal(goalName: string, params?: Record<string, string | number>) {
  if (typeof window === 'undefined' || !window.ym) return
  try {
    window.ym(METRIKA_ID, 'reachGoal', goalName, params)
  } catch {
    // ignore
  }
}

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void
  }
}
