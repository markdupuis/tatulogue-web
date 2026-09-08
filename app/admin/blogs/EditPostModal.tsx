'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

interface EditPostModalProps {
  slug: string;
  title: string;
  onClose: () => void;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function EditPostModal({ slug, title, onClose }: EditPostModalProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(null);
    fetch(`https://raw.githubusercontent.com/markdupuis/tatulogue-web/master/content/blog/${slug}.md`)
      .then((res) => {
        if (!res.ok) throw new Error(`Could not load post source (${res.status})`);
        return res.text();
      })
      .then((text) => {
        if (!active) return;
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load post');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  async function handleSave() {
    setSaveState('saving');
    setSaveError(null);
    try {
      const { error, response } = await supabase.functions.invoke('commit_blog_post', {
        body: { slug, content },
      });

      if (error) {
        // supabase-js puts a generic message on `error` for any non-2xx --
        // the actual { error: "..." } body this function returns is only
        // on the raw response.
        const body = await response?.json().catch(() => null);
        setSaveError(body?.error || error.message || 'Save failed');
        setSaveState('error');
        return;
      }

      setSaveState('saved');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
      setSaveState('error');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-white/8 bg-[#0c0c14] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div>
            <h2 className="font-semibold text-white">{title}</h2>
            <p className="text-xs text-white/40">content/blog/{slug}.md</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-white/40 hover:bg-white/[0.06] hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <p className="text-white/40">Loading post…</p>
          ) : loadError ? (
            <p className="text-red-400">{loadError}</p>
          ) : (
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (saveState !== 'idle') setSaveState('idle');
              }}
              spellCheck={false}
              className="h-[55vh] w-full resize-none rounded-xl border border-white/8 bg-white/[0.02] p-4 font-mono text-sm leading-relaxed text-white/90 focus:border-violet-500 focus:outline-none"
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/8 px-5 py-4">
          <div className="text-sm">
            {saveState === 'saved' && (
              <span className="text-green-400">Saved. Live in a few minutes once the site rebuilds.</span>
            )}
            {saveState === 'error' && <span className="text-red-400">{saveError}</span>}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/8 px-4 py-2 text-sm text-white/70 hover:bg-white/[0.06]"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading || !!loadError || saveState === 'saving'}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
            >
              {saveState === 'saving' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
