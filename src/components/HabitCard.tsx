import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import type { Habit } from '../types'

type HabitCardProps = {
  habit: Habit
  onToggle: (id: string) => void
}

const PARTICLE_COUNT = 8
const BURST_MS = 450

function streakLabel(streak: number): string {
  return `${streak} day streak`
}

function ParticleBurst() {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2
    const distance = 26 + (i % 2) * 10
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      color: i % 2 === 0 ? 'var(--accent-pulse)' : 'var(--accent-warm)',
    }
  })

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-8 top-1/2 z-20 -translate-y-1/2"
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: particle.color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  )
}

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const [bursting, setBursting] = useState(false)
  const done = habit.completedToday

  useEffect(() => {
    if (!bursting) return
    const timer = window.setTimeout(() => setBursting(false), BURST_MS)
    return () => window.clearTimeout(timer)
  }, [bursting])

  const handleToggle = () => {
    if (!done) setBursting(true)
    onToggle(habit.id)
  }

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileTap={{
        scale: 0.97,
        boxShadow:
          'inset 0 0 0 1px var(--accent-pulse), 0 0 20px rgba(94, 234, 212, 0.25)',
      }}
      transition={{ type: 'spring', stiffness: 520, damping: 28 }}
      aria-pressed={done}
      className={clsx(
        'relative flex w-full min-h-14 items-center gap-3.5 overflow-hidden',
        'rounded-2xl border px-4 py-3.5 text-left',
        'backdrop-blur-md outline-none',
        'focus-visible:ring-2 focus-visible:ring-accent-pulse/50',
        done
          ? 'border-border/50 bg-white/[0.02] opacity-65'
          : 'border-border bg-surface',
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span
        className={clsx(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl',
          done ? 'bg-white/[0.03] grayscale' : 'bg-white/[0.06]',
        )}
      >
        {habit.icon}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={clsx(
            'block font-display text-[1.05rem] font-medium tracking-tight',
            done ? 'text-text-muted' : 'text-text-primary',
          )}
        >
          {habit.name}
        </span>
        <span className="mt-0.5 block font-mono text-[0.7rem] text-text-muted">
          {streakLabel(habit.streak)}
        </span>
      </span>

      <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.span
              key="check"
              initial={{ scale: 0.55, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.55, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 520, damping: 24 }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-pulse text-bg"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
                <path
                  d="M3 7.2L5.8 10L11 3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          ) : (
            <motion.span
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-7 w-7 rounded-full border border-border"
            />
          )}
        </AnimatePresence>
      </span>

      <AnimatePresence>{bursting && <ParticleBurst />}</AnimatePresence>
    </motion.button>
  )
}
