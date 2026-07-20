import { useHabitStore } from '../store/useHabitStore'
import { useAppShell } from './AppShell'
import { EmptyState } from './EmptyState'
import { HabitCard } from './HabitCard'
import { PulseRing } from './PulseRing'

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
  const { openAddSheet, requestDelete } = useAppShell()

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

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-28">
        {habits.length === 0 ? (
          <EmptyState
            title="No habits yet"
            description="Build your own list — check in here each day to keep your pulse going."
            actionLabel="Add your first habit"
            onAction={openAddSheet}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {habits.map((habit) => (
              <li key={habit.id}>
                <HabitCard
                  habit={habit}
                  onToggle={toggleHabit}
                  onRequestDelete={requestDelete}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
