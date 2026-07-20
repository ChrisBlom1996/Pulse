export type Habit = {
  id: string
  name: string
  icon: string
  streak: number
  completedToday: boolean
  history: Record<string, boolean>
}
