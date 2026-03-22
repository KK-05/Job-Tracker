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
      <div className="group bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 hover:shadow-xl hover:shadow-violet-500/5 hover:border-violet-500/30 transition-all duration-300 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
              <Building2 size={20} className="text-violet-500" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-violet-500 transition-colors">
                {application.company_name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {application.role}
              </p>
            </div>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar size={14} />
            {new Date(application.applied_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <ArrowRight
            size={16}
            className="text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all duration-200"
          />
        </div>
      </div>
    </Link>
  );
}
