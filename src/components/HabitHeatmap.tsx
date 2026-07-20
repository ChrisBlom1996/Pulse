import clsx from 'clsx'
import {
  formatShortDate,
  isToday,
  lastNDateStrings,
} from '../services/trends'

const WINDOW_DAYS = 30

type HabitHeatmapProps = {
  history: Record<string, boolean>
  habitName: string
}

export function HabitHeatmap({ history, habitName }: HabitHeatmapProps) {
  const days = lastNDateStrings(WINDOW_DAYS)

  return (
    <div className="w-full">
      <div
        className="grid w-full gap-1"
        style={{ gridTemplateColumns: `repeat(${WINDOW_DAYS}, minmax(0, 1fr))` }}
        role="img"
        aria-label={`Last ${WINDOW_DAYS} days for ${habitName}`}
      >
        {days.map((date) => {
          const done = history[date] === true
          return (
            <div
              key={date}
              title={`${formatShortDate(date)}${done ? ' — done' : ''}`}
              className={clsx(
                'aspect-square rounded-[3px] border',
                done
                  ? 'border-accent-pulse/40 bg-accent-pulse'
                  : 'border-border/80 bg-white/[0.03]',
                isToday(date) && !done && 'border-text-muted/40',
                isToday(date) && done && 'ring-1 ring-accent-pulse/50 ring-offset-1 ring-offset-bg',
              )}
            />
          )
        })}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[0.65rem] text-text-muted">
        <span>{formatShortDate(days[0])}</span>
        <span>{formatShortDate(days[days.length - 1])}</span>
      </div>
    </div>
  )
}
