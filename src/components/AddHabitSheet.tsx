import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useState, type FormEvent } from 'react'
import clsx from 'clsx'
import { HABIT_ICON_OPTIONS } from '../constants/habitIcons'
import { useMotionPreference } from '../hooks/useMotionPreference'
import { useHabitStore } from '../store/useHabitStore'

type AddHabitSheetProps = {
  open: boolean
  onClose: () => void
}

export function AddHabitSheet({ open, onClose }: AddHabitSheetProps) {
  const addHabit = useHabitStore((state) => state.addHabit)
  const { reduceMotion } = useMotionPreference()
  const titleId = useId()
  const [name, setName] = useState('')
  const [icon, setIcon] = useState<string>(HABIT_ICON_OPTIONS[0].emoji)

  useEffect(() => {
    if (!open) return
    setName('')
    setIcon(HABIT_ICON_OPTIONS[0].emoji)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const canSubmit = name.trim().length > 0

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    addHabit(name, icon)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end">
          <motion.button
            type="button"
            aria-label="Dismiss"
            className="absolute inset-0 bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.2 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="
              relative z-10 rounded-t-[1.5rem] border border-border border-b-0
              bg-surface/95 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3
              backdrop-blur-xl
            "
            initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
            transition={
              reduceMotion
                ? { duration: 0.15 }
                : { type: 'spring', stiffness: 420, damping: 36 }
            }
          >
            <div
              aria-hidden
              className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15"
            />

            <h2
              id={titleId}
              className="font-display text-xl font-semibold tracking-tight text-text-primary"
            >
              New habit
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Name it and pick an icon.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.08em] text-text-muted">
                  Name
                </span>
                <input
                  autoFocus
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Morning run"
                  maxLength={40}
                  className="
                    w-full rounded-2xl border border-border bg-bg px-4 py-3.5
                    text-base text-text-primary placeholder:text-text-disabled
                    outline-none transition-colors
                    focus:border-accent-pulse/50
                  "
                />
              </label>

              <fieldset>
                <legend className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-text-muted">
                  Icon
                </legend>
                <div className="grid grid-cols-8 gap-2">
                  {HABIT_ICON_OPTIONS.map((option) => {
                    const selected = icon === option.emoji
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-label={option.label}
                        aria-pressed={selected}
                        onClick={() => setIcon(option.emoji)}
                        className={clsx(
                          'flex aspect-square items-center justify-center rounded-xl text-xl',
                          'border transition-colors',
                          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                          'focus-visible:outline-[color-mix(in_srgb,var(--accent-pulse)_70%,transparent)]',
                          selected
                            ? 'border-accent-pulse bg-accent-pulse/10'
                            : 'border-border bg-bg hover:bg-surface-hover',
                        )}
                      >
                        {option.emoji}
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={!canSubmit}
                className={clsx(
                  'min-h-14 rounded-2xl font-medium transition-opacity',
                  canSubmit
                    ? 'bg-accent-pulse text-bg hover:opacity-90'
                    : 'cursor-not-allowed bg-surface text-text-disabled',
                )}
              >
                Add habit
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
