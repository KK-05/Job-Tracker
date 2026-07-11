interface StatusBadgeProps {
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
}

const statusConfig = {
  Applied: {
    bg: 'bg-[var(--indigo)]/12',
    text: 'text-[var(--indigo-bright)]',
    dot: 'bg-[var(--indigo)]',
  },
  Interview: {
    bg: 'bg-[var(--amber)]/12',
    text: 'text-[var(--amber-bright)]',
    dot: 'bg-[var(--amber)] animate-pulse-dot',
  },
  Offer: {
    bg: 'bg-[var(--sage)]/15',
    text: 'text-[var(--sage-bright)]',
    dot: 'bg-[var(--sage-bright)]',
  },
  // Styled quietly rather than alarming red — a rejection is
  // information, not a warning.
  Rejected: {
    bg: 'bg-[var(--text-faint)]/10',
    text: 'text-[var(--text-faint)]',
    dot: 'bg-[var(--text-faint)]',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.Applied;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
