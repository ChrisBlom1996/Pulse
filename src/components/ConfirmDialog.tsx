import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId } from 'react'
import { useMotionPreference } from '../hooks/useMotionPreference'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const { reduceMotion } = useMotionPreference()
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
          <motion.button
            type="button"
            aria-label="Dismiss"
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onCancel}
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="
              relative z-10 w-full max-w-sm rounded-2xl border border-border
              bg-surface/95 p-5 backdrop-blur-xl
            "
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={
              reduceMotion
                ? { duration: 0.12 }
                : { type: 'spring', stiffness: 480, damping: 32 }
            }
          >
            <h2
              id={titleId}
              className="font-display text-lg font-semibold tracking-tight text-text-primary"
            >
              {title}
            </h2>
            <div className="mt-2 text-sm leading-relaxed text-text-muted">
              {description}
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="
                  min-h-12 flex-1 rounded-xl border border-border bg-bg
                  text-sm font-medium text-text-primary
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-[color-mix(in_srgb,var(--accent-pulse)_70%,transparent)]
                "
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="
                  min-h-12 flex-1 rounded-xl bg-danger text-sm font-medium text-bg
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-[color-mix(in_srgb,var(--accent-pulse)_70%,transparent)]
                "
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
