'use client';

import Link from 'next/link';

interface SidebarProps {
  active: string;
}

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'overview', label: 'Overview', href: '/admin', icon: '📊' },
  { key: 'bugs', label: 'Bug Reports', href: '/admin/bugs', icon: '🐛' },
  { key: 'roadmap', label: 'Roadmap', href: '/admin/roadmap', icon: '🗺️' },
  { key: 'blogs', label: 'Blogs', href: '/admin/blogs', icon: '📝' },
  { key: 'users', label: 'Users', href: '/admin/users', icon: '👥' },
  { key: 'waitlist', label: 'Waitlist', href: '/admin/waitlist', icon: '📋' },
  { key: 'analytics', label: 'Analytics', href: '/admin/analytics', icon: '📈' },
];

export default function Sidebar({ active }: SidebarProps) {
  return (
    <aside className="w-56 min-h-screen border-r border-white/8 bg-white/[0.02] flex flex-col">
      <div className="px-4 py-6">
        <div className="text-lg font-semibold text-white">Tatulogue</div>
        <div className="text-xs text-white/40">Admin</div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active;
          const classes = isActive
            ? 'text-violet-400 bg-violet-600/10 border border-violet-600/20'
            : 'text-white/50 hover:text-white hover:bg-white/[0.04] border border-transparent';
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${classes}`}
            >
              <span aria-hidden>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4">
        <Link
          href="/"
          className="block rounded-xl px-3 py-2 text-sm text-white/40 hover:text-white hover:bg-white/[0.04]"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
