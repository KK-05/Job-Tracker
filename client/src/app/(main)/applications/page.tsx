'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApplicationStore } from '@/features/applications/applicationStore';
import ApplicationTimeline from '@/components/ApplicationTimeline';
import { Plus, X, Filter, Loader2, Search } from 'lucide-react';

const STATUSES = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function ApplicationsPage() {
  const { applications, fetchApplications, createApplication, isLoading } = useApplicationStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);

  const searchQuery = searchParams.get('search') || '';

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Applied');
  const [jobDescription, setJobDescription] = useState('');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    if (searchParams.get('new') === 'true') setShowForm(true);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createApplication({
      company_name: companyName,
      role,
      status: status as 'Applied' | 'Interview' | 'Offer' | 'Rejected',
      job_description: jobDescription,
      applied_date: appliedDate,
    });
    setShowForm(false);
    setCompanyName('');
    setRole('');
    setStatus('Applied');
    setJobDescription('');
    setAppliedDate(new Date().toISOString().split('T')[0]);
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(params.toString() ? `/applications?${params.toString()}` : '/applications');
  };

  const filtered = applications.filter((a) => {
    const matchesStatus = filter === 'All' || a.status === filter;
    const matchesSearch =
      !searchQuery ||
      a.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const emptyMessage = searchQuery
    ? `No applications match "${searchQuery}".`
    : filter === 'All'
      ? 'No applications yet. Click "Add application" to get started!'
      : `No ${filter.toLowerCase()} applications.`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-[var(--text)]">
            Applications
          </h1>
          <p className="text-sm text-[var(--text-dim)] mt-1">
            {searchQuery
              ? `${filtered.length} of ${applications.length} applications match your search`
              : `${applications.length} total applications`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--sage)] to-[#3f6e5f] text-[var(--bg)] text-sm font-semibold hover:brightness-110 shadow-[0_10px_28px_-10px_rgba(91,140,123,0.5)] transition-all"
        >
          <Plus size={18} />
          Add application
        </button>
      </div>

      {/* Active search indicator */}
      {searchQuery && (
        <div className="flex items-center gap-2 text-sm">
          <Search size={14} className="text-[var(--text-faint)]" />
          <span className="text-[var(--text-dim)]">
            Searching for <span className="text-[var(--text)] font-medium">&ldquo;{searchQuery}&rdquo;</span>
          </span>
          <button
            onClick={clearSearch}
            className="flex items-center gap-1 text-[var(--sage-bright)] hover:text-[var(--sage)] transition-colors"
          >
            <X size={14} />
            Clear
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={16} className="text-[var(--text-faint)]" />
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              filter === s
                ? 'bg-[var(--sage)]/15 text-[var(--sage-bright)] border-[var(--sage)]/30'
                : 'bg-[var(--surface)] text-[var(--text-dim)] border-[var(--border)] hover:border-[var(--border-hi)] hover:text-[var(--text)]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* New Application Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-hi)] w-full max-w-lg p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-medium text-[var(--text)]">
                New application
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-xl hover:bg-[var(--surface-2)] transition-colors"
              >
                <X size={20} className="text-[var(--text-faint)]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-dim)] mb-1.5">
                  Company name *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sage)]/40 focus:border-[var(--sage)]/50 transition-all"
                  placeholder="e.g. Google"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-dim)] mb-1.5">
                  Role *
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sage)]/40 focus:border-[var(--sage)]/50 transition-all"
                  placeholder="e.g. Frontend Engineer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-dim)] mb-1.5">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sage)]/40 focus:border-[var(--sage)]/50 transition-all"
                  >
                    {STATUSES.filter((s) => s !== 'All').map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-dim)] mb-1.5">
                    Applied date
                  </label>
                  <input
                    type="date"
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sage)]/40 focus:border-[var(--sage)]/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-dim)] mb-1.5">
                  Job description
                </label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sage)]/40 focus:border-[var(--sage)]/50 transition-all resize-none"
                  placeholder="Paste the job description here..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--sage)] to-[#3f6e5f] text-[var(--bg)] font-semibold text-sm hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_10px_28px_-10px_rgba(91,140,123,0.5)]"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  'Save application'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Applications Timeline */}
      {isLoading && applications.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[var(--surface)] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <ApplicationTimeline
          applications={filtered}
          emptyMessage={emptyMessage}
        />
      )}
    </div>
  );
}