'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../../../lib/supabase';

type SessionState = 'checking' | 'ready' | 'invalid';
type SubmitState = 'idle' | 'submitting' | 'done' | 'error';

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordPage() {
  const [sessionState, setSessionState] = useState<SessionState>('checking');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    // The recovery link's token is parsed from the URL automatically by the
    // Supabase client, which then establishes a temporary recovery session.
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSessionState(data.session ? 'ready' : 'invalid');
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitState('submitting');
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setSubmitState('error');
      return;
    }

    setSubmitState('done');
  }

  return (
    <div className="min-h-screen bg-[#07070d] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/8 bg-white/[0.02] px-6 py-8">
        <h1 className="text-2xl font-semibold">Set a new password</h1>
        <p className="text-sm text-white/40 mb-6">Tatulogue dashboard</p>

        {sessionState === 'checking' && <p className="text-white/40">Checking your link…</p>}

        {sessionState === 'invalid' && (
          <p className="text-sm text-red-400">
            This link is invalid or has expired. Ask an admin to send a new password reset from
            the Users page.
          </p>
        )}

        {sessionState === 'ready' && submitState !== 'done' && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              autoComplete="new-password"
              className="w-full rounded-xl bg-white px-3 py-2 text-black"
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className="w-full rounded-xl bg-white px-3 py-2 text-black"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={submitState === 'submitting'}
              className="w-full rounded-xl bg-violet-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {submitState === 'submitting' ? 'Saving…' : 'Set password'}
            </button>
          </form>
        )}

        {submitState === 'done' && (
          <div className="space-y-4">
            <p className="text-sm text-emerald-400">Password updated. You can sign in now.</p>
            <a
              href="/admin"
              className="block w-full rounded-xl bg-violet-600 px-3 py-2 text-center text-sm font-medium text-white"
            >
              Go to dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
