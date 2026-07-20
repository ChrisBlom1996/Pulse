import { useEffect } from 'react'
import { PhoneFrame } from './components/PhoneFrame'
import { useTodayProgress } from './hooks/useTodayProgress'
import { useHabitStore } from './store/useHabitStore'

function App() {
  const habits = useHabitStore((state) => state.habits)
  const progress = useTodayProgress()

  useEffect(() => {
    console.log('[Pulse] habit store', habits)
    console.log('[Pulse] today progress', {
      completed: progress.completed,
      total: progress.total,
      percent: progress.percent,
    })
  }, [habits, progress.completed, progress.total, progress.percent])

  return (
    <PhoneFrame>
      <div className="flex h-full items-center justify-center bg-bg text-text-primary">
        <h1 className="font-display text-2xl font-medium tracking-tight">
          Pulse
        </h1>
      </div>
    </PhoneFrame>
  )
}

export default App
