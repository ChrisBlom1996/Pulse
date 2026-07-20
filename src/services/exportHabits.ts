import type { Habit } from '../types'
import { HABIT_STORAGE_KEY } from './habitStorage'

export type PulseExportPayload = {
  app: 'Pulse'
  version: string
  exportedAt: string
  habits: Habit[]
}

export function buildExportPayload(
  habits: Habit[],
  version: string,
): PulseExportPayload {
  return {
    app: 'Pulse',
    version,
    exportedAt: new Date().toISOString(),
    habits,
  }
}

/** Trigger a browser download of the habit store as JSON. */
export function downloadHabitsJson(
  habits: Habit[],
  version: string,
): void {
  const payload = buildExportPayload(habits, version)
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const stamp = payload.exportedAt.slice(0, 10)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `pulse-habits-${stamp}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function clearPersistedHabits(): void {
  localStorage.removeItem(HABIT_STORAGE_KEY)
}
