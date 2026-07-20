import { useHabitStore } from '../store/useHabitStore'
import { useAppShell } from './AppShell'
import { EmptyState } from './EmptyState'
import { HabitTrendCard } from './HabitTrendCard'

export function TrendsScreen() {
  const habits = useHabitStore((state) => state.habits)
  const { openAddSheet } = useAppShell()

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="shrink-0 px-4 pb-2 pt-[max(3.5rem,env(safe-area-inset-top))] min-[500px]:pt-16">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-muted">
          Last 30 days
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-text-primary">
          Trends
        </h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28">
        {habits.length === 0 ? (
          <EmptyState
            title="Nothing to show yet"
            description="Complete a habit to start your trend — add one to begin."
            actionLabel="Add your first habit"
            onAction={openAddSheet}
          />
        ) : (
          <ul className="flex flex-col gap-3 pt-2">
            {habits.map((habit) => (
              <li key={habit.id}>
                <HabitTrendCard habit={habit} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
