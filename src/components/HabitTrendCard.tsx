import type { Habit } from '../types'
import {
  bestStreakFromHistory,
  completionPercentInWindow,
  hasCompletionHistory,
} from '../services/trends'
import { EmptyState } from './EmptyState'
import { HabitHeatmap } from './HabitHeatmap'

const WINDOW_DAYS = 30

type HabitTrendCardProps = {
  habit: Habit
}

export function HabitTrendCard({ habit }: HabitTrendCardProps) {
  const hasHistory = hasCompletionHistory(habit.history)
  const best = bestStreakFromHistory(habit.history)
  const rate = completionPercentInWindow(habit.history, WINDOW_DAYS)

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 backdrop-blur-md">
      <header className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-xl">
          {habit.icon}
        </span>
        <h2 className="font-display text-base font-medium tracking-tight text-text-primary">
          {habit.name}
        </h2>
      </header>

      {!hasHistory ? (
        <EmptyState
          title="Nothing to show yet"
          description="Complete a habit to start your trend."
        />
      ) : (
        <>
          <HabitHeatmap history={habit.history} habitName={habit.name} />

          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.08em] text-text-muted">
                Streak
              </dt>
              <dd className="mt-1 font-mono text-lg text-text-primary">
                {habit.streak}
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.08em] text-text-muted">
                Best
              </dt>
              <dd className="mt-1 font-mono text-lg text-text-primary">
                {best}
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.08em] text-text-muted">
                30d
              </dt>
              <dd className="mt-1 font-mono text-lg text-text-primary">
                {rate}%
              </dd>
            </div>
          </dl>
        </>
      )}
    </section>
  )
}
