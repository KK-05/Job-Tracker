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

const PIE_COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

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
        <div className="h-12 bg-slate-800/50 rounded-xl w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 bg-slate-800/50 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <BarChart3 size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400">
          No data available. Start adding applications!
        </p>
      </div>
    );
  }

  const rateCards = [
    {
      label: 'Total Applications',
      value: data.total_applications,
      icon: Briefcase,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
    },
    {
      label: 'Interview Rate',
      value: `${data.interview_rate}%`,
      icon: TrendingUp,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Offer Rate',
      value: `${data.offer_rate}%`,
      icon: Award,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Rejection Rate',
      value: `${data.rejection_rate}%`,
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Visualize your job search progress
        </p>
      </div>

      {/* Rate Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {rateCards.map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon size={20} className={card.color} />
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{card.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Per Month */}
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
            Applications Per Month
          </h3>
          {data.applications_per_month.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.applications_per_month}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  fill="url(#areaGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center py-12">No data yet</p>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
            Status Distribution
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
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center py-12">No data yet</p>
          )}
        </div>

        {/* Bar Chart - By Status */}
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
            Applications by Status
          </h3>
          {data.status_distribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.status_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="status" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {data.status_distribution.map((_, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center py-12">No data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
