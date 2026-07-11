import Link from 'next/link';
import { Building2 } from 'lucide-react';

interface TimelineApplication {
  id: string;
  company_name: string;
  role: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  applied_date: string;
}

interface ApplicationTimelineProps {
  applications: TimelineApplication[];
  emptyMessage?: string;
}

const dotStyles = {
  Applied: 'border-[var(--indigo)]/50',
  Interview: 'border-[var(--amber)]/60',
  Offer: 'border-[var(--sage)] shadow-[0_0_0_4px_rgba(91,140,123,0.15)]',
  Rejected: 'border-[var(--border-hi)] opacity-60',
};

const pulseStyles = {
  Applied: 'bg-[var(--indigo)]',
  Interview: 'bg-[var(--amber)] animate-pulse-dot',
  Offer: 'bg-[var(--sage-bright)]',
  Rejected: 'bg-[var(--text-faint)]',
};

const badgeStyles = {
  Applied: 'bg-[var(--indigo)]/12 text-[var(--indigo-bright)]',
  Interview: 'bg-[var(--amber)]/12 text-[var(--amber-bright)]',
  Offer: 'bg-[var(--sage)]/15 text-[var(--sage-bright)]',
  Rejected: 'bg-[var(--text-faint)]/10 text-[var(--text-faint)]',
};

const badgeLabel = {
  Applied: 'Applied',
  Interview: 'Interview',
  Offer: 'Offer',
  Rejected: 'Closed',
};

/**
 * The "current" — a vertical flow of applications in motion,
 * replacing the static card grid. Same data shape as
 * ApplicationCard, so it's a drop-in swap wherever a list of
 * applications is rendered.
 */
export default function ApplicationTimeline({
  applications,
  emptyMessage = 'No applications yet.',
}: ApplicationTimelineProps) {
  if (applications.length === 0) {
    return (
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-12 text-center">
        <p className="text-[var(--text-dim)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="absolute left-[23px] top-2 bottom-2 w-px opacity-50"
        style={{
          background:
            'linear-gradient(to bottom, var(--sage) 0%, var(--indigo) 55%, var(--border) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="space-y-0">
        {applications.map((app) => (
          <Link key={app.id} href={`/applications/${app.id}`}>
            <div className="flex gap-5 pb-6 last:pb-0 group">
              <div
                className={`w-12 h-12 rounded-full flex-shrink-0 relative z-10 flex items-center justify-center bg-[var(--surface)] border-[1.5px] ${dotStyles[app.status]}`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${pulseStyles[app.status]}`} />
              </div>

              <div className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-5 py-4 flex items-center justify-between gap-4 group-hover:border-[var(--border-hi)] group-hover:translate-x-1 transition-all duration-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[var(--surface-2)] flex items-center justify-center flex-shrink-0">
                    <Building2 size={16} className="text-[var(--sage-bright)]" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[var(--text)] truncate">{app.company_name}</div>
                    <div className="text-sm text-[var(--text-dim)] truncate">{app.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${badgeStyles[app.status]}`}>
                    {badgeLabel[app.status]}
                  </span>
                  <span className="text-xs text-[var(--text-faint)] whitespace-nowrap hidden sm:inline">
                    {new Date(app.applied_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
