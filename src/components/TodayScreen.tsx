import { useHabitStore } from '../store/useHabitStore'
import { HabitCard } from './HabitCard'

function todayHeading(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

export function TodayScreen() {
  const habits = useHabitStore((state) => state.habits)
  const toggleHabit = useHabitStore((state) => state.toggleHabit)

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="shrink-0 px-5 pb-4 pt-14 min-[500px]:pt-16">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-muted">
          {todayHeading()}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-text-primary">
          Pulse
        </h1>
        <p className="mt-1.5 text-sm text-text-muted">
          Check in on today&apos;s habits
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
        <ul className="flex flex-col gap-3">
          {habits.map((habit) => (
            <li key={habit.id}>
              <HabitCard habit={habit} onToggle={toggleHabit} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
