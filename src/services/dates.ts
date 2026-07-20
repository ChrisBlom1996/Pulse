/** Local calendar date as YYYY-MM-DD (not UTC). */
export function toDateString(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function daysAgo(n: number, from: Date = new Date()): string {
  const date = new Date(from)
  date.setDate(date.getDate() - n)
  return toDateString(date)
}

/** Build consecutive completed days ending yesterday (today left open). */
export function buildStreakHistory(streak: number): Record<string, boolean> {
  const history: Record<string, boolean> = {}
  for (let i = 1; i <= streak; i += 1) {
    history[daysAgo(i)] = true
  }
  return history
}
