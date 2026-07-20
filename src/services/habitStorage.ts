import type { Habit } from '../types'

export const HABIT_STORAGE_KEY = 'pulse-habits-v1'

/** Slice of store state written to localStorage. */
export type PersistedHabitState = {
  habits: Habit[]
}

export function partializeHabits<T extends PersistedHabitState>(
  state: T,
): PersistedHabitState {
  return { habits: state.habits }
}
