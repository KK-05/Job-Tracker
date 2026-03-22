'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApplicationStore } from '@/features/applications/applicationStore';
import ApplicationCard from '@/components/ApplicationCard';
import { Plus, X, Filter, Loader2 } from 'lucide-react';

const STATUSES = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function ApplicationsPage() {
  const { applications, fetchApplications, createApplication, isLoading } = useApplicationStore();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);

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

  const filtered =
    filter === 'All'
      ? applications
      : applications.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Applications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {applications.length} total applications
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-cyan-500 shadow-lg shadow-violet-500/25 transition-all"
        >
          <Plus size={18} />
          Add Application
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-slate-400" />
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === s
                ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* New Application Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                New Application
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                  placeholder="e.g. Google"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                  Role *
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                  placeholder="e.g. Frontend Engineer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                  >
                    {STATUSES.filter((s) => s !== 'All').map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    Applied Date
                  </label>
                  <input
                    type="date"
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                  Job Description
                </label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all resize-none"
                  placeholder="Paste the job description here..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-cyan-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  'Save Application'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Applications Grid */}
      {isLoading && applications.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-slate-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            {filter === 'All'
              ? 'No applications yet. Click "Add Application" to get started!'
              : `No ${filter.toLowerCase()} applications.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
