import type { ReactNode } from 'react'
import clsx from 'clsx'

type SettingsRowProps = {
  label: string
  description?: string
  trailing?: ReactNode
  onClick?: () => void
  disabled?: boolean
  danger?: boolean
}

export function SettingsRow({
  label,
  description,
  trailing,
  onClick,
  disabled = false,
  danger = false,
}: SettingsRowProps) {
  const interactive = Boolean(onClick) && !disabled

  const className = clsx(
    'flex w-full min-h-14 items-center gap-4 px-4 py-3.5 text-left',
    'transition-colors duration-150',
    interactive && 'hover:bg-surface-hover',
    disabled && 'cursor-not-allowed opacity-60',
    !disabled &&
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
    !disabled &&
      'focus-visible:outline-[color-mix(in_srgb,var(--accent-pulse)_70%,transparent)]',
  )

  const content = (
    <>
      <span className="min-w-0 flex-1">
        <span
          className={clsx(
            'block text-[0.95rem] font-medium',
            danger ? 'text-danger' : 'text-text-primary',
          )}
        >
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-sm leading-snug text-text-muted">
            {description}
          </span>
        )}
      </span>
      {trailing && (
        <span className="shrink-0 font-mono text-xs text-text-muted">
          {trailing}
        </span>
      )}
    </>
  )

  if (interactive) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    )
  }

  return (
    <div className={className} aria-disabled={disabled || undefined}>
      {content}
    </div>
  )
}
