/** Preset icons for new habits — not seeded habit data. */
export const HABIT_ICON_OPTIONS = [
  { id: 'water', emoji: '💧', label: 'Water' },
  { id: 'code', emoji: '💻', label: 'Code' },
  { id: 'meditate', emoji: '🧘', label: 'Meditate' },
  { id: 'book', emoji: '📖', label: 'Book' },
  { id: 'strength', emoji: '🏋️', label: 'Strength' },
  { id: 'moon', emoji: '🌙', label: 'Moon' },
  { id: 'sun', emoji: '☀️', label: 'Sun' },
  { id: 'write', emoji: '✏️', label: 'Write' },
] as const

export type HabitIconOption = (typeof HABIT_ICON_OPTIONS)[number]
