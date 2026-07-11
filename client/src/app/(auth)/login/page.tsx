'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/authStore';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] p-8 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-11 h-11 rounded-xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-[var(--sage)] to-[var(--indigo)]">
            <LogIn size={20} className="text-[var(--bg)]" />
          </div>
          <h1 className="font-display text-3xl font-medium text-[var(--text)]">
            Welcome back
          </h1>
          <p className="text-[var(--text-dim)] mt-2 text-sm">
            Sign in to your JobTracker AI account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/25 text-[var(--danger-bright)] text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--sage)]/40 focus:border-[var(--sage)]/50 transition-all text-sm"
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--sage)]/40 focus:border-[var(--sage)]/50 transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--sage)] to-[#3f6e5f] text-[var(--bg)] font-semibold text-sm hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--sage)]/50 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_10px_28px_-10px_rgba(91,140,123,0.5)]"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                Sign in
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-[var(--text-dim)]">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-[var(--sage-bright)] hover:text-[var(--sage)] font-medium transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
