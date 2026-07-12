'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/authStore';
import { User, Search } from 'lucide-react';

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    router.push(trimmed ? `/applications?search=${encodeURIComponent(trimmed)}` : '/applications');
  };

  return (
    <header className="sticky top-0 z-20 bg-[var(--bg)]/85 backdrop-blur-xl border-b border-[var(--border)]">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Left spacer for mobile hamburger */}
        <div className="w-10 lg:hidden" />

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search applications by company or role..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--sage)]/30 focus:border-[var(--sage)]/40 transition-all"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          </div>
        </form>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-4 border-l border-[var(--border)]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--sage)] to-[var(--indigo)] flex items-center justify-center">
              <User size={16} className="text-[var(--bg)]" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[var(--text)]">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-[var(--text-faint)]">{user?.email || ''}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}