type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start px-1 py-6">
      <p className="font-display text-xl font-medium tracking-tight text-text-primary">
        {title}
      </p>
      <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-text-muted">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="
            mt-5 min-h-14 rounded-2xl bg-accent-pulse px-5
            font-medium text-bg transition-opacity
            hover:opacity-90
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-[color-mix(in_srgb,var(--accent-pulse)_70%,transparent)]
          "
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
