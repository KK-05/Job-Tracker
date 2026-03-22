'use client';

import { useEffect, useState } from 'react';
import { applicationApi } from '@/services/api';
import ApplicationCard from '@/components/ApplicationCard';
import { Briefcase, TrendingUp, Award, XCircle, Plus } from 'lucide-react';
import Link from 'next/link';

interface Analytics {
  total_applications: number;
  interview_count: number;
  offer_count: number;
  rejection_count: number;
  interview_rate: number;
  offer_rate: number;
  rejection_rate: number;
}

interface Application {
  id: string;
  company_name: string;
  role: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  applied_date: string;
  created_at: string;
}

const statCards = [
  {
    key: 'total_applications',
    label: 'Total Applications',
    icon: Briefcase,
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10',
    text: 'text-violet-500',
  },
  {
    key: 'interview_count',
    label: 'Interviews',
    icon: TrendingUp,
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    rateKey: 'interview_rate',
  },
  {
    key: 'offer_count',
    label: 'Offers',
    icon: Award,
    gradient: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    rateKey: 'offer_rate',
  },
  {
    key: 'rejection_count',
    label: 'Rejections',
    icon: XCircle,
    gradient: 'from-red-500 to-rose-600',
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    rateKey: 'rejection_rate',
  },
];

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recent, setRecent] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [analyticsRes, applicationsRes] = await Promise.all([
          applicationApi.getAnalytics(),
          applicationApi.getAll({ limit: '5', sort: 'created_at', order: 'DESC' }),
        ]);
        setAnalytics(analyticsRes.data.data);
        setRecent(applicationsRes.data.data);
      } catch {
        console.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-800/50 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-slate-800/50 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your job search at a glance
          </p>
        </div>
        <Link
          href="/applications?new=true"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-cyan-500 shadow-lg shadow-violet-500/25 transition-all"
        >
          <Plus size={18} />
          New Application
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const value = analytics?.[card.key as keyof Analytics] ?? 0;
          const rate = card.rateKey
            ? analytics?.[card.rateKey as keyof Analytics]
            : null;

          return (
            <div
              key={card.key}
              className="relative overflow-hidden bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
                    {value}
                  </p>
                  {rate !== null && rate !== undefined && (
                    <p className={`text-xs mt-1 font-medium ${card.text}`}>
                      {rate}% rate
                    </p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <card.icon size={24} className={card.text} />
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />
            </div>
          );
        })}
      </div>

      {/* Recent Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Recent Applications
          </h2>
          <Link
            href="/applications"
            className="text-sm text-violet-500 hover:text-violet-400 font-medium transition-colors"
          >
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-12 text-center">
            <Briefcase size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              No applications yet. Start tracking your job search!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recent.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
