import Link from 'next/link';
import StatusBadge from './StatusBadge';
import { Building2, Calendar, ArrowRight } from 'lucide-react';

interface ApplicationCardProps {
  application: {
    id: string;
    company_name: string;
    role: string;
    status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
    applied_date: string;
  };
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Link href={`/applications/${application.id}`}>
      <div className="group bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 hover:border-[var(--sage)]/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center">
              <Building2 size={20} className="text-[var(--sage-bright)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--sage-bright)] transition-colors">
                {application.company_name}
              </h3>
              <p className="text-sm text-[var(--text-dim)]">
                {application.role}
              </p>
            </div>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]">
            <Calendar size={14} />
            {new Date(application.applied_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <ArrowRight
            size={16}
            className="text-[var(--text-faint)] group-hover:text-[var(--sage-bright)] group-hover:translate-x-1 transition-all duration-200"
          />
        </div>
      </div>
    </Link>
  );
}
