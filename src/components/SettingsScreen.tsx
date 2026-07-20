import { useState } from 'react'
import { downloadHabitsJson } from '../services/exportHabits'
import { useHabitStore } from '../store/useHabitStore'
import { ConfirmDialog } from './ConfirmDialog'
import { SettingsRow } from './SettingsRow'

const APP_VERSION = __APP_VERSION__

export function SettingsScreen() {
  const habits = useHabitStore((state) => state.habits)
  const resetAllData = useHabitStore((state) => state.resetAllData)
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <div className="relative flex h-full flex-col bg-bg">
      <header className="shrink-0 px-4 pb-2 pt-[max(3.5rem,env(safe-area-inset-top))] min-[500px]:pt-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text-primary">
          Settings
        </h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-4">
        <section className="mb-8">
          <h2 className="mb-3 px-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-text-muted">
            Preferences
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface backdrop-blur-md">
            <SettingsRow
              label="Reminders"
              description="Daily check-in nudges"
              trailing="Coming soon"
              disabled
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 px-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-text-muted">
            Data
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface backdrop-blur-md">
            <SettingsRow
              label="Export data"
              description="Download habits and history as JSON"
              onClick={() => downloadHabitsJson(habits, APP_VERSION)}
            />
            <div className="mx-4 border-t border-border" />
            <SettingsRow
              label="Reset all data"
              description="Remove every habit and streak"
              danger
              onClick={() => setConfirmReset(true)}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 px-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-text-muted">
            About
          </h2>
          <div className="rounded-2xl border border-border bg-surface px-4 py-5 backdrop-blur-md">
            <p className="font-display text-lg font-semibold tracking-tight text-text-primary">
              Pulse
            </p>
            <p className="mt-2 max-w-[20rem] text-sm leading-relaxed text-text-muted">
              A minimalist daily habit and mood tracker — your check-ins, at a
              glance.
            </p>
            <p className="mt-4 font-mono text-xs text-text-muted">
              Version {APP_VERSION}
            </p>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset all data?"
        description="Every habit, streak, and history entry will be permanently deleted from this device."
        confirmLabel="Reset"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetAllData()
          setConfirmReset(false)
        }}
      />
    </div>
  )
}
