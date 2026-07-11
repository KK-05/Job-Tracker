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
      <div className="bg-gradient-to-br from-[var(--indigo)]/8 to-[var(--sage)]/5 rounded-2xl border border-[var(--indigo)]/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-[var(--indigo-bright)] animate-pulse" size={24} />
          <h3 className="font-display font-medium text-[var(--text)]">
            AI is analyzing...
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-[var(--surface-2)] rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis && matchScore === undefined) return null;

  return (
    <div className="bg-gradient-to-br from-[var(--indigo)]/8 to-[var(--sage)]/5 rounded-2xl border border-[var(--indigo)]/20 p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--indigo)] to-[var(--sage)] flex items-center justify-center">
          <Sparkles size={20} className="text-[var(--bg)]" />
        </div>
        <div>
          <h3 className="font-display font-medium text-[var(--text)]">
            AI insights
          </h3>
          <p className="text-xs text-[var(--text-faint)]">Powered by Gemini</p>
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
                stroke="var(--border-hi)"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#insightGradient)"
                strokeWidth="3"
                strokeDasharray={`${matchScore}, 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="insightGradient">
                  <stop offset="0%" stopColor="var(--sage)" />
                  <stop offset="100%" stopColor="var(--indigo)" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-medium text-[var(--text)]">
              {matchScore}%
            </span>
          </div>
          <div>
            <p className="font-medium text-[var(--text)]">Match score</p>
            <p className="text-sm text-[var(--text-faint)]">
              {matchScore >= 80 ? 'Excellent match' : matchScore >= 60 ? 'Good match' : 'Room for improvement'}
            </p>
          </div>
        </div>
      )}

      {/* Strengths */}
      {analysis?.strengths && analysis.strengths.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[var(--sage-bright)]" />
            <h4 className="text-sm font-semibold text-[var(--sage-bright)]">
              Strengths
            </h4>
          </div>
          <ul className="space-y-1">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="text-sm text-[var(--text-dim)] pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-[var(--sage-bright)]">
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
            <AlertTriangle size={16} className="text-[var(--amber-bright)]" />
            <h4 className="text-sm font-semibold text-[var(--amber-bright)]">
              Areas to improve
            </h4>
          </div>
          <ul className="space-y-1">
            {analysis.weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-[var(--text-dim)] pl-6 relative before:content-['!'] before:absolute before:left-1 before:text-[var(--amber-bright)] before:font-bold">
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
            <Lightbulb size={16} className="text-[var(--indigo-bright)]" />
            <h4 className="text-sm font-semibold text-[var(--indigo-bright)]">
              Suggestions
            </h4>
          </div>
          <ul className="space-y-1">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="text-sm text-[var(--text-dim)] pl-6 relative before:content-['→'] before:absolute before:left-0 before:text-[var(--indigo-bright)]">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Skills */}
      {missing_skills && missing_skills.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--danger-bright)] mb-2">Missing skills</h4>
          <div className="flex flex-wrap gap-2">
            {missing_skills.map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-[var(--danger)]/10 text-[var(--danger-bright)] text-xs font-medium border border-[var(--danger)]/20"
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
