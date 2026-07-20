import { useHabitStore } from '../store/useHabitStore'

export function useTodayProgress() {
  const habits = useHabitStore((state) => state.habits)

  const completed = habits.filter((habit) => habit.completedToday).length
  const total = habits.length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return { completed, total, percent }
}
