import { useState } from 'react'
import { Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { useHabitStore } from '../store/useHabitStore'
import { AddHabitSheet } from './AddHabitSheet'
import { BottomNav } from './BottomNav'
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog'

export type AppShellContext = {
  openAddSheet: () => void
  requestDelete: (id: string) => void
}

export function useAppShell() {
  return useOutletContext<AppShellContext>()
}

export function AppShell() {
  const location = useLocation()
  const habits = useHabitStore((state) => state.habits)
  const deleteHabit = useHabitStore((state) => state.deleteHabit)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const pendingHabit = habits.find((habit) => habit.id === pendingDeleteId)
  const isToday = location.pathname === '/'
  const showFab = isToday && habits.length > 0

  const context: AppShellContext = {
    openAddSheet: () => setSheetOpen(true),
    requestDelete: setPendingDeleteId,
  }

  return (
    <div className="relative flex h-full flex-col bg-bg">
      <div className="min-h-0 flex-1 overflow-hidden">
        <Outlet context={context} />
      </div>

      <BottomNav />

      {showFab && (
        <button
          type="button"
          aria-label="Add habit"
          onClick={() => setSheetOpen(true)}
          className="
            absolute bottom-[5.25rem] right-5 z-20
            flex h-14 w-14 items-center justify-center rounded-full
            bg-accent-pulse text-2xl font-medium leading-none text-bg
            shadow-[0_8px_24px_rgba(94,234,212,0.28)]
            transition-opacity hover:opacity-90
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-[color-mix(in_srgb,var(--accent-pulse)_70%,transparent)]
          "
        >
          +
        </button>
      )}

      <AddHabitSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />

      <ConfirmDeleteDialog
        open={pendingDeleteId != null && pendingHabit != null}
        habitName={pendingHabit?.name ?? ''}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteHabit(pendingDeleteId)
          setPendingDeleteId(null)
        }}
      />
    </div>
  )
}
