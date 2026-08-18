'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { useAdminAuth } from '../../lib/admin/useAdminAuth';
import { PASSWORD_RESET_REDIRECT } from '../../lib/admin/queries';
import { supabase } from '../../lib/supabase';
import Sidebar from './Sidebar';

type AuthView = 'signin' | 'forgot';
type ForgotStatus = 'idle' | 'sending' | 'sent';

interface AdminShellProps {
  active: string;
  title: string;
  children: ReactNode;
}

export default function AdminShell({ active, title, children }: AdminShellProps) {
  const { authed, loading, error, signIn, signOut } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState<AuthView>('signin');
  const [forgotStatus, setForgotStatus] = useState<ForgotStatus>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    await signIn(email, password);
    setSubmitting(false);
  }

  async function handleForgotSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setForgotStatus('sending');
    // Don't reveal whether the email has an account either way — same
    // response regardless, which is standard practice for this flow.
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: PASSWORD_RESET_REDIRECT });
    setForgotStatus('sent');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070d] text-white/40 flex items-center justify-center">
        Loading…
      </div>
    );
  }

  if (!authed && view === 'forgot') {
    return (
      <div className="min-h-screen bg-[#07070d] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl border border-white/8 bg-white/[0.02] px-6 py-8">
          <h1 className="text-2xl font-semibold">Reset password</h1>
          <p className="text-sm text-white/40 mb-6">Tatulogue dashboard</p>

          {forgotStatus === 'sent' ? (
            <p className="text-sm text-white/70">
              If that email has an admin account, a reset link is on its way. Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                required
                className="w-full rounded-xl bg-white px-3 py-2 text-black"
              />
              <button
                type="submit"
                disabled={forgotStatus === 'sending'}
                className="w-full rounded-xl bg-violet-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {forgotStatus === 'sending' ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => {
              setView('signin');
              setForgotStatus('idle');
            }}
            className="mt-4 text-sm text-white/40 hover:text-white"
          >
            &larr; Back to sign in
          </button>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#07070d] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl border border-white/8 bg-white/[0.02] px-6 py-8">
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-sm text-white/40 mb-6">Tatulogue dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className="w-full rounded-xl bg-white px-3 py-2 text-black"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full rounded-xl bg-white px-3 py-2 text-black"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-violet-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setView('forgot')}
            className="mt-4 text-sm text-white/40 hover:text-white"
          >
            Forgot password?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070d] text-white flex">
      <Sidebar active={active} />
      <main className="flex-1 min-w-0">
        <header className="border-b border-white/8 px-8 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">{title}</h1>
          <button
            type="button"
            onClick={signOut}
            className="rounded-xl px-3 py-1.5 text-sm text-white/50 hover:text-white hover:bg-white/[0.04]"
          >
            Sign out
          </button>
        </header>
        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
