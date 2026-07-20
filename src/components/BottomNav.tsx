import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const tabs = [
  {
    to: '/',
    label: 'Today',
    end: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 3v2M16 3v2M4.5 8h15M6 5.5h12A1.5 1.5 0 0 1 19.5 7v12a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19V7A1.5 1.5 0 0 1 6 5.5Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 12.5h3M8.5 16h7"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: '/trends',
    label: 'Trends',
    end: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 19V5M4 19h16"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M7.5 15.5 11 11l3 2.5 4.5-6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    end: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M12 3.5v2.2M12 18.3v2.2M4.9 6.4l1.6 1.5M17.5 16.1l1.6 1.5M3.5 12h2.2M18.3 12h2.2M4.9 17.6l1.6-1.5M17.5 7.9l1.6-1.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
] as const

export function BottomNav() {
  return (
    <nav
      className="
        absolute inset-x-0 bottom-0 z-30
        border-t border-border bg-surface/80 backdrop-blur-xl
        pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-2
      "
      aria-label="Main"
    >
      <ul className="grid grid-cols-3 px-2">
        {tabs.map((tab) => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[0.65rem] font-medium tracking-wide transition-colors',
                  isActive ? 'text-accent-pulse' : 'text-text-muted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={clsx(isActive && 'drop-shadow-[0_0_8px_rgba(94,234,212,0.45)]')}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
