'use client';

import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

interface AIInsightPanelProps {
  matchScore?: number;
  feedback?: string;
  analysis?: {
    strengths?: string[];
    weaknesses?: string[];
    suggestions?: string[];
  };
  missing_skills?: string[];
  isLoading?: boolean;
}

export default function AIInsightPanel({
  matchScore,
  analysis,
  missing_skills,
  isLoading,
}: AIInsightPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-violet-500/5 to-cyan-500/5 rounded-2xl border border-violet-500/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-violet-500 animate-pulse" size={24} />
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">
            AI is analyzing...
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis && matchScore === undefined) return null;

  return (
    <div className="bg-gradient-to-br from-violet-500/5 to-cyan-500/5 rounded-2xl border border-violet-500/20 p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">
            AI Insights
          </h3>
          <p className="text-xs text-slate-400">Powered by GPT-4</p>
        </div>
      </div>

      {/* Match Score */}
      {matchScore !== undefined && (
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-700"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray={`${matchScore}, 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-700 dark:text-white">
              {matchScore}%
            </span>
          </div>
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200">Match Score</p>
            <p className="text-sm text-slate-400">
              {matchScore >= 80 ? 'Excellent match!' : matchScore >= 60 ? 'Good match' : 'Room for improvement'}
            </p>
          </div>
        </div>
      )}

      {/* Strengths */}
      {analysis?.strengths && analysis.strengths.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-emerald-500" />
            <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Strengths
            </h4>
          </div>
          <ul className="space-y-1">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-300 pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-emerald-500">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {analysis?.weaknesses && analysis.weaknesses.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber-500" />
            <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              Areas to Improve
            </h4>
          </div>
          <ul className="space-y-1">
            {analysis.weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-300 pl-6 relative before:content-['!'] before:absolute before:left-1 before:text-amber-500 before:font-bold">
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {analysis?.suggestions && analysis.suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-violet-500" />
            <h4 className="text-sm font-semibold text-violet-600 dark:text-violet-400">
              Suggestions
            </h4>
          </div>
          <ul className="space-y-1">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-300 pl-6 relative before:content-['→'] before:absolute before:left-0 before:text-violet-500">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Skills */}
      {missing_skills && missing_skills.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-red-500 mb-2">Missing Skills</h4>
          <div className="flex flex-wrap gap-2">
            {missing_skills.map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs font-medium border border-red-500/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
