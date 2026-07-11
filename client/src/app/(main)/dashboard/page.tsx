'use client';

import { useEffect, useState } from 'react';
import { applicationApi } from '@/services/api';
import { useAuthStore } from '@/features/auth/authStore';
import ApplicationTimeline from '@/components/ApplicationTimeline';
import ProgressRing from '@/components/ProgressRing';
import type { LucideIcon } from 'lucide-react';
import { Briefcase, TrendingUp, Award, XCircle, Plus, Sparkles } from 'lucide-react';
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

interface StatCard {
  key: keyof Analytics;
  label: string;
  icon: LucideIcon;
  accent: string;
  accentBright: string;
  rateKey?: keyof Analytics;
}

const statCards: StatCard[] = [
  {
    key: 'total_applications',
    label: 'Total applications',
    icon: Briefcase,
    accent: 'var(--indigo)',
    accentBright: 'var(--indigo-bright)',
  },
  {
    key: 'interview_count',
    label: 'Interviews',
    icon: TrendingUp,
    accent: 'var(--amber)',
    accentBright: 'var(--amber-bright)',
    rateKey: 'interview_rate',
  },
  {
    key: 'offer_count',
    label: 'Offers',
    icon: Award,
    accent: 'var(--sage)',
    accentBright: 'var(--sage-bright)',
    rateKey: 'offer_rate',
  },
  {
    key: 'rejection_count',
    label: 'Closed',
    icon: XCircle,
    accent: 'var(--text-faint)',
    accentBright: 'var(--text-dim)',
    rateKey: 'rejection_rate',
  },
] as const;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
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
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-6">
          <div className="h-40 bg-[var(--surface)] rounded-2xl" />
          <div className="h-40 bg-[var(--surface)] rounded-2xl" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[var(--surface)] rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-[var(--surface)] rounded-2xl" />
      </div>
    );
  }

  const total = analytics?.total_applications ?? 0;
  const closed = analytics?.rejection_count ?? 0;
  const activeRate = total ? Math.round(((total - closed) / total) * 100) : 0;
  const activeCount = total - closed;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-6 animate-fade-up">
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-3xl md:text-4xl font-medium leading-tight text-[var(--text)]">
            {getGreeting()}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}.
            <br />
            You&apos;re <span className="text-[var(--sage-bright)]">in flow</span>.
          </h1>
          <p className="text-[var(--text-dim)] text-sm mt-3 max-w-md">
            {total > 0
              ? `${activeCount} of ${total} application${total === 1 ? '' : 's'} still moving. Keep the current going — momentum compounds.`
              : 'Log your first application to start building momentum.'}
          </p>
          <div className="flex gap-3 mt-6">
            <Link
              href="/applications?new=true"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--sage)] to-[#3f6e5f] text-[var(--bg)] text-sm font-semibold hover:brightness-110 shadow-[0_10px_28px_-10px_rgba(91,140,123,0.5)] transition-all"
            >
              <Plus size={18} />
              Log an application
            </Link>
            <Link
              href="/applications"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border-hi)] text-[var(--text-dim)] text-sm font-semibold hover:text-[var(--text)] hover:border-[var(--text-faint)] transition-all"
            >
              View timeline
            </Link>
          </div>
        </div>

        <ProgressRing
          percent={activeRate}
          label="Active"
          caption={
            total > 0 ? (
              <>
                {activeCount} of {total} applications still{' '}
                <strong className="text-[var(--sage-bright)] font-semibold">moving forward</strong> — no
                response isn&apos;t the same as no.
              </>
            ) : (
              'Your funnel will fill in as you add applications.'
            )
          }
        />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const value = analytics?.[card.key as keyof Analytics] ?? 0;
          const rate = card.rateKey ? analytics?.[card.rateKey as keyof Analytics] : null;

          return (
            <div
              key={card.key}
              className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 hover:border-[var(--border-hi)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5"
                style={{ backgroundColor: `color-mix(in srgb, ${card.accent} 15%, transparent)` }}
              >
                <card.icon size={17} style={{ color: card.accentBright }} />
              </div>
              <p className="font-display text-2xl font-medium text-[var(--text)]">{value}</p>
              <p className="text-xs text-[var(--text-dim)] mt-1">{card.label}</p>
              {rate !== null && rate !== undefined && (
                <p className="text-[11px] mt-1 font-medium" style={{ color: card.accentBright }}>
                  {rate}% rate
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Applications — the flow */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-xl font-medium text-[var(--text)]">Your current</h2>
            <p className="text-sm text-[var(--text-dim)] mt-0.5">Recent applications, in motion</p>
          </div>
          <Link
            href="/applications"
            className="text-sm text-[var(--sage-bright)] hover:text-[var(--sage)] font-medium transition-colors"
          >
            View all →
          </Link>
        </div>

        <ApplicationTimeline
          applications={recent}
          emptyMessage="No applications yet. Start tracking your job search!"
        />
      </div>

      {total === 0 && (
        <div className="flex items-center gap-3 text-[var(--text-faint)] text-xs">
          <Sparkles size={14} />
          Tip: add a job description when logging an application to unlock AI match scoring.
        </div>
      )}
    </div>
  );
}
