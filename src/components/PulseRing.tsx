import { motion, useAnimationControls } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useTodayProgress } from '../hooks/useTodayProgress'
import { useHabitStore } from '../store/useHabitStore'

const SIZE = 148
const STROKE = 7
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function PulseRing() {
  const { completed, total, percent } = useTodayProgress()
  const habits = useHabitStore((state) => state.habits)
  const controls = useAnimationControls()
  const prevSignature = useRef<string | null>(null)
  const signature = habits
    .map((habit) => `${habit.id}:${habit.completedToday ? 1 : 0}`)
    .join('|')

  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE

  useEffect(() => {
    if (prevSignature.current === null) {
      prevSignature.current = signature
      return
    }
    if (prevSignature.current === signature) return
    prevSignature.current = signature

    void controls.start({
      scale: [1, 1.06, 1],
      boxShadow: [
        '0 0 0 0 rgba(94, 234, 212, 0)',
        '0 0 28px 4px rgba(94, 234, 212, 0.35)',
        '0 0 0 0 rgba(94, 234, 212, 0)',
      ],
      transition: {
        duration: 0.38,
        times: [0, 0.28, 1],
        ease: ['easeOut', 'easeIn'],
      },
    })
  }, [signature, controls])

  return (
    <motion.div
      className="relative mx-auto flex h-[148px] w-[148px] items-center justify-center rounded-full"
      animate={controls}
      initial={{ scale: 1, boxShadow: '0 0 0 0 rgba(94, 234, 212, 0)' }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE}
        />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--accent-pulse)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-display text-[1.85rem] font-semibold leading-none tracking-tight text-text-primary">
          {completed}
          <span className="text-text-muted">/{total}</span>
        </p>
        <p className="mt-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-text-muted">
          today
        </p>
      </div>
    </motion.div>
  )
}
