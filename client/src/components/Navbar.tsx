'use client';

import { useAuthStore } from '@/features/auth/authStore';
import { User, Bell } from 'lucide-react';

export default function Navbar() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/50">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Left spacer for mobile hamburger */}
        <div className="w-10 lg:hidden" />

        {/* Search placeholder */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search applications..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-xl text-slate-500 hover:text-violet-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-slate-400">{user?.email || ''}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
