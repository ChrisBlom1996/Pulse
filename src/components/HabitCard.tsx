import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useMotionPreference } from '../hooks/useMotionPreference'
import type { Habit } from '../types'

type HabitCardProps = {
  habit: Habit
  onToggle: (id: string) => void
  onRequestDelete: (id: string) => void
}

const PARTICLE_COUNT = 8
const BURST_MS = 450
const DELETE_WIDTH = 88
const OPEN_THRESHOLD = -48

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

export function HabitCard({ habit, onToggle, onRequestDelete }: HabitCardProps) {
  const [bursting, setBursting] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const { reduceMotion } = useMotionPreference()
  const done = habit.completedToday
  const x = useMotionValue(0)
  const deleteOpacity = useTransform(x, [0, -DELETE_WIDTH], [0.4, 1])
  const longPressTimer = useRef<number | null>(null)
  const didDrag = useRef(false)

  useEffect(() => {
    if (!bursting) return
    const timer = window.setTimeout(() => setBursting(false), BURST_MS)
    return () => window.clearTimeout(timer)
  }, [bursting])

  useEffect(() => {
    return () => {
      if (longPressTimer.current) window.clearTimeout(longPressTimer.current)
    }
  }, [])

  const clearLongPress = () => {
    if (longPressTimer.current != null) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const snap = (open: boolean) => {
    setRevealed(open)
    void animate(x, open ? -DELETE_WIDTH : 0, {
      type: 'spring',
      stiffness: 480,
      damping: 36,
    })
  }

  const handleToggle = () => {
    if (didDrag.current) {
      didDrag.current = false
      return
    }
    if (revealed) {
      snap(false)
      return
    }
    if (!done && !reduceMotion) setBursting(true)
    onToggle(habit.id)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <motion.button
        type="button"
        aria-label={`Delete ${habit.name}`}
        style={{ opacity: deleteOpacity }}
        onClick={() => onRequestDelete(habit.id)}
        className="
          absolute inset-y-0 right-0 flex w-[88px] items-center justify-center
          bg-danger text-sm font-medium text-bg
        "
      >
        Delete
      </motion.button>

      <motion.button
        type="button"
        drag={reduceMotion ? false : 'x'}
        dragConstraints={{ left: -DELETE_WIDTH, right: 0 }}
        dragElastic={0.06}
        style={{ x, WebkitTapHighlightColor: 'transparent' }}
        onDragStart={() => {
          clearLongPress()
          didDrag.current = false
        }}
        onDrag={(_, info) => {
          if (Math.abs(info.offset.x) > 8) didDrag.current = true
        }}
        onDragEnd={(_, info) => {
          const projected = x.get() + info.velocity.x * 0.15
          snap(projected <= OPEN_THRESHOLD)
        }}
        onPointerDown={() => {
          clearLongPress()
          longPressTimer.current = window.setTimeout(() => {
            onRequestDelete(habit.id)
          }, 550)
        }}
        onPointerUp={clearLongPress}
        onPointerLeave={clearLongPress}
        onPointerCancel={clearLongPress}
        onClick={handleToggle}
        whileTap={
          reduceMotion
            ? { opacity: 0.85 }
            : revealed || didDrag.current
              ? undefined
              : {
                  scale: 0.97,
                  boxShadow:
                    'inset 0 0 0 1px var(--accent-pulse), 0 0 20px rgba(94, 234, 212, 0.25)',
                }
        }
        transition={
          reduceMotion
            ? { duration: 0.15 }
            : { type: 'spring', stiffness: 520, damping: 28 }
        }
        aria-pressed={done}
        className={clsx(
          'relative z-10 flex w-full min-h-14 items-center gap-3.5 overflow-hidden',
          'rounded-2xl border px-4 py-3.5 text-left',
          'backdrop-blur-md outline-none touch-pan-y',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          'focus-visible:outline-[color-mix(in_srgb,var(--accent-pulse)_70%,transparent)]',
          done ? 'border-border/60 bg-bg' : 'border-border bg-surface',
        )}
      >
        <span
          className={clsx(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl transition-colors duration-200',
            done ? 'bg-white/[0.03] grayscale' : 'bg-white/[0.06]',
          )}
        >
          {habit.icon}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={clsx(
              'block font-display text-[1.05rem] font-medium tracking-tight transition-colors duration-200',
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
                initial={
                  reduceMotion ? { opacity: 0 } : { scale: 0.55, opacity: 0 }
                }
                animate={
                  reduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }
                }
                exit={
                  reduceMotion ? { opacity: 0 } : { scale: 0.55, opacity: 0 }
                }
                transition={
                  reduceMotion
                    ? { duration: 0.15 }
                    : { type: 'spring', stiffness: 520, damping: 24 }
                }
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
                transition={{ duration: 0.15 }}
                className="h-7 w-7 rounded-full border border-border"
              />
            )}
          </AnimatePresence>
        </span>

        <AnimatePresence>
          {bursting && !reduceMotion && <ParticleBurst />}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
