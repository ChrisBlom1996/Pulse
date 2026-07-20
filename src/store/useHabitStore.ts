import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { daysAgo, toDateString } from '../services/dates'
import { clearPersistedHabits } from '../services/exportHabits'
import {
  HABIT_STORAGE_KEY,
  partializeHabits,
} from '../services/habitStorage'
import type { Habit } from '../types'

type HabitState = {
  habits: Habit[]
  toggleHabit: (id: string) => void
  addHabit: (name: string, icon: string) => void
  deleteHabit: (id: string) => void
  /** Wipe in-memory habits and clear persisted localStorage. */
  resetAllData: () => void
  /** Align completedToday / streak with the current calendar day after rehydrate or midnight. */
  syncForToday: () => void
}

function syncHabitForToday(
  habit: Habit,
  today: string,
  yesterday: string,
): Habit {
  const completedToday = habit.history[today] === true

  let streak = habit.streak
  if (!completedToday && habit.history[yesterday] !== true) {
    streak = 0
  }

  return {
    ...habit,
    completedToday,
    streak,
  }
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],

      syncForToday: () => {
        const today = toDateString()
        const yesterday = daysAgo(1)

        set({
          habits: get().habits.map((habit) =>
            syncHabitForToday(habit, today, yesterday),
          ),
        })
      },

      toggleHabit: (id) => {
        const today = toDateString()
        const yesterday = daysAgo(1)

        set({
          habits: get().habits.map((habit) => {
            if (habit.id !== id) return habit

            const completedToday = !habit.completedToday
            const history = { ...habit.history, [today]: completedToday }

            let streak = habit.streak
            if (completedToday) {
              streak = habit.history[yesterday] === true ? habit.streak + 1 : 1
            } else {
              streak = Math.max(0, habit.streak - 1)
            }

            return { ...habit, completedToday, history, streak }
          }),
        })
      },

      addHabit: (name, icon) => {
        const habit: Habit = {
          id: crypto.randomUUID(),
          name: name.trim(),
          icon,
          streak: 0,
          completedToday: false,
          history: {},
        }
        set({ habits: [...get().habits, habit] })
      },

      deleteHabit: (id) => {
        set({ habits: get().habits.filter((habit) => habit.id !== id) })
      },

      resetAllData: () => {
        set({ habits: [] })
        clearPersistedHabits()
      },
    }),
    {
      name: HABIT_STORAGE_KEY,
      partialize: partializeHabits,
      onRehydrateStorage: () => (state) => {
        state?.syncForToday()
      },
    },
  ),
)
