'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

interface AdminAuthState {
  authed: boolean;
  loading: boolean;
  error: string;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('web_admins')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  return Boolean(data);
}

export function useAdminAuth(): AdminAuthState {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (user && (await isAdmin(user.id))) {
        if (active) setAuthed(true);
      }
      if (active) setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  async function signIn(email: string, password: string): Promise<void> {
    setError('');
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setError('Incorrect email or password.');
      return;
    }

    if (!(await isAdmin(data.user.id))) {
      await supabase.auth.signOut();
      setError('You do not have admin access.');
      return;
    }

    setAuthed(true);
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
    setAuthed(false);
  }

  return { authed, loading, error, signIn, signOut };
}
