'use client';

import { useEffect, useState } from 'react';

interface ProgressRingProps {
  percent: number;
  label: string;
  caption?: React.ReactNode;
}

const RADIUS = 55;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressRing({ percent, label, caption }: ProgressRingProps) {
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 150);
    return () => clearTimeout(t);
  }, []);

  const clamped = Math.max(0, Math.min(100, percent));
  const offset = CIRCUMFERENCE - (filled ? (CIRCUMFERENCE * clamped) / 100 : 0);

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-7 flex flex-col items-center justify-center gap-3.5 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)]">
      <div className="relative w-[150px] h-[150px] animate-breathe">
        <svg width="150" height="150" viewBox="0 0 150 150" className="-rotate-90">
          <defs>
            <linearGradient id="progressRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--sage)" />
              <stop offset="100%" stopColor="var(--indigo)" />
            </linearGradient>
          </defs>
          <circle cx="75" cy="75" r={RADIUS} fill="none" stroke="var(--border-hi)" strokeWidth="8" />
          <circle
            cx="75"
            cy="75"
            r={RADIUS}
            fill="none"
            stroke="url(#progressRingGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-medium text-[var(--text)]">{clamped}%</span>
          <span className="text-[11px] text-[var(--text-dim)] uppercase tracking-wide mt-0.5">{label}</span>
        </div>
      </div>
      {caption && (
        <p className="text-[13px] text-[var(--text-dim)] text-center leading-relaxed max-w-[220px]">{caption}</p>
      )}
    </div>
  );
}
