import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <div className="relative flex h-full flex-col bg-bg">
      <div className="min-h-0 flex-1 overflow-hidden">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
