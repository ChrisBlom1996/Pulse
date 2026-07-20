import { daysAgo, toDateString } from './dates'

/** Oldest → newest date strings for the last `n` local calendar days (includes today). */
export function lastNDateStrings(n: number, from: Date = new Date()): string[] {
  return Array.from({ length: n }, (_, index) => daysAgo(n - 1 - index, from))
}

export function hasCompletionHistory(history: Record<string, boolean>): boolean {
  return Object.values(history).some(Boolean)
}

export function completionPercentInWindow(
  history: Record<string, boolean>,
  days: number,
): number {
  const window = lastNDateStrings(days)
  const completed = window.filter((date) => history[date] === true).length
  return Math.round((completed / days) * 100)
}

function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function dayDiff(a: string, b: string): number {
  const ms = parseLocalDate(b).getTime() - parseLocalDate(a).getTime()
  return Math.round(ms / 86_400_000)
}

/** Longest consecutive completed-day run in history. */
export function bestStreakFromHistory(
  history: Record<string, boolean>,
): number {
  const completed = Object.keys(history)
    .filter((date) => history[date] === true)
    .sort()

  if (completed.length === 0) return 0

  let best = 1
  let run = 1

  for (let i = 1; i < completed.length; i += 1) {
    if (dayDiff(completed[i - 1], completed[i]) === 1) {
      run += 1
      best = Math.max(best, run)
    } else {
      run = 1
    }
  }

  return best
}

export function formatShortDate(dateString: string): string {
  const date = parseLocalDate(dateString)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function isToday(dateString: string): boolean {
  return dateString === toDateString()
}
