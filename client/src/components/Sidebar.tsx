'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/features/auth/authStore';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/applications', label: 'Applications', icon: Briefcase },
  { href: '/resume', label: 'Resume', icon: FileText },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[var(--surface)] border border-[var(--border-hi)] text-[var(--text)] shadow-lg"
      >
        {collapsed ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full bg-[var(--surface)] border-r border-[var(--border)] text-[var(--text)] z-40 transition-transform duration-300 ease-in-out
        ${collapsed ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:w-64 w-64 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-[var(--sage)] to-[var(--indigo)] flex-shrink-0">
            <Briefcase size={16} className="text-[var(--bg)]" />
          </div>
          <div>
            <h1 className="font-display text-lg font-medium leading-tight">JobTracker</h1>
            <p className="text-xs text-[var(--text-faint)]">AI-powered job search</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setCollapsed(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${
                    isActive
                      ? 'bg-[var(--sage)]/12 text-[var(--sage-bright)]'
                      : 'text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                  }`}
              >
                <item.icon
                  size={20}
                  className={`transition-colors ${isActive ? 'text-[var(--sage-bright)]' : 'text-[var(--text-faint)] group-hover:text-[var(--sage-bright)]'}`}
                />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--sage-bright)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[var(--border)]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-dim)] hover:text-[var(--danger-bright)] hover:bg-[var(--danger)]/10 transition-all duration-200"
          >
            <LogOut size={20} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {collapsed && (
        <div
          onClick={() => setCollapsed(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}
    </>
  );
}
