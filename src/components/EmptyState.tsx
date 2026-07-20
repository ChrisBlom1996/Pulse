type EmptyStateProps = {
  onAdd: () => void
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start px-1 py-6">
      <p className="font-display text-xl font-medium tracking-tight text-text-primary">
        No habits yet
      </p>
      <p className="mt-2 max-w-[17rem] text-sm leading-relaxed text-text-muted">
        Build your own list — check in here each day to keep your pulse going.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="
          mt-5 min-h-14 rounded-2xl bg-accent-pulse px-5
          font-medium text-bg transition-opacity
          hover:opacity-90
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-[color-mix(in_srgb,var(--accent-pulse)_70%,transparent)]
        "
      >
        Add your first habit
      </button>
    </div>
  )
}
