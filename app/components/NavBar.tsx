"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../providers/AuthContext';

export default function NavBar() {
  const { status, logout } = useAuth();
  const pathname = usePathname();
  const user = status.user;
  const isAdmin = !!user && (user.role === 'admin' || user.role === 'superadmin');
  const links = [
    { href: '/directory', label: 'Directory' },
    { href: '/events', label: 'Events' },
    { href: '/mentorship', label: 'Mentorship' },
    { href: '/donations', label: 'Donations' },
    { href: '/profile', label: 'Profile', auth: true },
    { href: '/alumni', label: 'Alumni', auth: true }
  ];

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <header className="w-full sticky top-0 z-50 shadow-lg shadow-black/30">
      <div className="relative bg-[#0c0f19] text-slate-200 border-b border-indigo-700/40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.25),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-900/60 via-slate-900/40 to-fuchsia-900/40 mix-blend-plus-lighter" />
        <div className="relative max-w-7xl mx-auto flex items-center gap-5 px-4 py-3 text-sm">
          <Link href="/" className="relative font-semibold tracking-wide text-indigo-300 hover:text-white transition">
            <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">Alumni Platform</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {links.map(l => {
              if (l.auth && !status.authenticated) return null;
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-1.5 rounded-full transition font-medium relative overflow-hidden
                    ${active ? 'text-white' : 'text-slate-300 hover:text-white'} group`}
                >
                  <span className="relative z-10">{l.label}</span>
                  <span className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-indigo-600/60 to-fuchsia-600/50 blur-[1px]`} />
                  {active && <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-600 ring-1 ring-white/10 shadow-inner" />}
                </Link>
              );
            })}
            {isAdmin && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" /> Admin
              </span>
            )}
          </nav>
          <div className="flex items-center gap-2 ml-auto">
            {!status.loaded && <span className="animate-pulse text-slate-400">Loading…</span>}
            {status.loaded && !status.authenticated && (
              <Link href="/auth" className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-400 hover:to-fuchsia-500 text-white font-medium shadow-md shadow-indigo-900/40 transition">
                Sign In
              </Link>
            )}
            {status.loaded && status.authenticated && (
              <>
                <span className="flex items-center gap-2 max-w-[180px] pl-1 pr-2 py-1 rounded-full bg-white/5 ring-1 ring-white/10">
                  {user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image as string}
                      alt={user?.name || user?.email || 'User'}
                      className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-[10px] flex items-center justify-center font-semibold text-white">
                      {(user?.name || user?.email || '?').slice(0,1).toUpperCase()}
                    </span>
                  )}
                  <span className="truncate text-xs font-medium" title={user?.name || user?.email}>
                    {user?.name || user?.email}
                  </span>
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600/50 to-fuchsia-600/50 hover:from-indigo-500/60 hover:to-fuchsia-500/60 text-slate-100 text-xs font-semibold ring-1 ring-white/10 transition shadow-sm"
                >Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="md:hidden bg-[#0c0f19] border-b border-indigo-700/40 px-3 pb-3 flex flex-wrap gap-2">
        {links.map(l => {
          if (l.auth && !status.authenticated) return null;
          const active = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition relative overflow-hidden
                ${active ? 'text-white bg-gradient-to-r from-indigo-600 to-fuchsia-600 ring-1 ring-white/10' : 'text-slate-300 bg-white/5 hover:bg-white/10'}
              `}
            >{l.label}</Link>
          );
        })}
        {isAdmin && <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30">Admin</span>}
      </div>
    </header>
  );
}
