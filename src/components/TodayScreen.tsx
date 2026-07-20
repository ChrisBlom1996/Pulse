import { useHabitStore } from '../store/useHabitStore'
import { HabitCard } from './HabitCard'
import { PulseRing } from './PulseRing'

function todayHeading(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

function EmptyHabits() {
  return (
    <div className="flex flex-col items-start px-1 py-6">
      <p className="font-display text-xl font-medium tracking-tight text-text-primary">
        Nothing on your pulse yet
      </p>
      <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-text-muted">
        Add a habit when you&apos;re ready — this is where you&apos;ll check in
        each day.
      </p>
    </div>
  )
}

export function TodayScreen() {
  const habits = useHabitStore((state) => state.habits)
  const toggleHabit = useHabitStore((state) => state.toggleHabit)

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="shrink-0 px-5 pb-2 pt-[max(3.5rem,env(safe-area-inset-top))] min-[500px]:pt-16">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-muted">
          {todayHeading()}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-text-primary">
          Pulse
        </h1>
      </header>

      <div className="shrink-0 px-5 py-4">
        <PulseRing />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-[5.5rem]">
        {habits.length === 0 ? (
          <EmptyHabits />
        ) : (
          <ul className="flex flex-col gap-3">
            {habits.map((habit) => (
              <li key={habit.id}>
                <HabitCard habit={habit} onToggle={toggleHabit} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
