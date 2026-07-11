'use client';

import { useEffect, useState } from 'react';
import { applicationApi } from '@/services/api';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { BarChart3, TrendingUp, Award, XCircle, Briefcase } from 'lucide-react';

interface AnalyticsData {
  total_applications: number;
  interview_count: number;
  offer_count: number;
  rejection_count: number;
  interview_rate: number;
  offer_rate: number;
  rejection_rate: number;
  applications_per_month: { month: string; count: number }[];
  status_distribution: { status: string; count: number }[];
}

// Literal hex values here (not CSS vars) — Recharts renders these as raw
// SVG attributes, and this keeps chart color resolution unambiguous.
// Mirrors the tokens in globals.css.
const STATUS_COLORS: Record<string, string> = {
  Applied: '#B3A9E8',
  Interview: '#F0B679',
  Offer: '#79AC99',
  Rejected: '#5B636B',
};
const FALLBACK_COLOR = '#7A6BC7';
const GRID_COLOR = 'rgba(232, 230, 222, 0.08)';
const AXIS_COLOR = '#5B636B';
const TOOLTIP_STYLE = {
  background: '#1A2129',
  border: '1px solid rgba(232, 230, 222, 0.14)',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#E8E6DE',
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await applicationApi.getAnalytics();
        setData(res.data.data);
      } catch {
        console.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-[var(--surface)] rounded-xl w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 bg-[var(--surface)] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <BarChart3 size={48} className="text-[var(--text-faint)] mx-auto mb-4" />
        <p className="text-[var(--text-dim)]">
          No data available. Start adding applications!
        </p>
      </div>
    );
  }

  const rateCards = [
    {
      label: 'Total applications',
      value: data.total_applications,
      icon: Briefcase,
      color: 'text-[var(--indigo-bright)]',
      bg: 'bg-[var(--indigo)]/10',
    },
    {
      label: 'Interview rate',
      value: `${data.interview_rate}%`,
      icon: TrendingUp,
      color: 'text-[var(--amber-bright)]',
      bg: 'bg-[var(--amber)]/10',
    },
    {
      label: 'Offer rate',
      value: `${data.offer_rate}%`,
      icon: Award,
      color: 'text-[var(--sage-bright)]',
      bg: 'bg-[var(--sage)]/10',
    },
    {
      label: 'Rejection rate',
      value: `${data.rejection_rate}%`,
      icon: XCircle,
      color: 'text-[var(--text-dim)]',
      bg: 'bg-[var(--text-faint)]/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-medium text-[var(--text)]">Analytics</h1>
        <p className="text-sm text-[var(--text-dim)] mt-1">
          Visualize your job search progress
        </p>
      </div>

      {/* Rate Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {rateCards.map((card) => (
          <div
            key={card.label}
            className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon size={20} className={card.color} />
            </div>
            <p className="font-display text-2xl font-medium text-[var(--text)]">{card.value}</p>
            <p className="text-xs text-[var(--text-dim)] mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Per Month */}
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6">
          <h3 className="font-display text-base font-medium text-[var(--text)] mb-4">
            Applications per month
          </h3>
          {data.applications_per_month.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.applications_per_month}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B8C7B" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7A6BC7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                <XAxis dataKey="month" stroke={AXIS_COLOR} fontSize={12} />
                <YAxis stroke={AXIS_COLOR} fontSize={12} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#79AC99"
                  fill="url(#areaGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-[var(--text-faint)] text-center py-12">No data yet</p>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6">
          <h3 className="font-display text-base font-medium text-[var(--text)] mb-4">
            Status distribution
          </h3>
          {data.status_distribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.status_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {data.status_distribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[data.status_distribution[index].status] || FALLBACK_COLOR}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#9AA1A8' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-[var(--text-faint)] text-center py-12">No data yet</p>
          )}
        </div>

        {/* Bar Chart - By Status */}
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 lg:col-span-2">
          <h3 className="font-display text-base font-medium text-[var(--text)] mb-4">
            Applications by status
          </h3>
          {data.status_distribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.status_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                <XAxis dataKey="status" stroke={AXIS_COLOR} fontSize={12} />
                <YAxis stroke={AXIS_COLOR} fontSize={12} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {data.status_distribution.map((_, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={STATUS_COLORS[data.status_distribution[index].status] || FALLBACK_COLOR}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-[var(--text-faint)] text-center py-12">No data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
