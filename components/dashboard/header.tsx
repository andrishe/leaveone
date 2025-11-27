'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { primaryNavigation, settingsNavigation } from './sidebar';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatRole(role?: string | null) {
  if (!role) return 'Employé';
  switch (role) {
    case 'ADMIN':
      return 'Administrateur';
    case 'MANAGER':
      return 'Manager';
    default:
      return 'Employé';
  }
}

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const name = session?.user?.name ?? 'Utilisateur';
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const role = formatRole(userRole);
  const initials = getInitials(name);
  const firstName = name.split(' ')[0] ?? name;

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('overflow-hidden');

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('overflow-hidden');
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="h-16 bg-white/70 backdrop-blur border-b border-blue-100/60 dark:bg-slate-950/70 dark:border-slate-700/60 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100/60 text-blue-600 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700/60 dark:text-blue-200 dark:hover:bg-slate-900 lg:hidden"
            aria-label="Ouvrir la navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-slate-900 dark:text-white lg:hidden">
            Bonjour, {firstName}
          </span>
        </div>

        {/* Search */}
        <div className="hidden flex-1 md:block md:max-w-xl md:px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
            <input
              type="text"
              placeholder="Rechercher un employé, une demande..."
              className="w-full rounded-lg border border-blue-100/60 bg-white/70 py-2 pl-10 pr-4 text-sm text-slate-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Profile */}
          <div className="flex items-center gap-3 md:gap-4 md:border-l md:border-blue-100/60 md:pl-4 dark:md:border-slate-700/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-600 via-indigo-500 to-cyan-500 text-sm font-semibold text-white shadow">
              {initials}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {role}
              </p>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/50"
            role="presentation"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative ml-auto flex h-full w-80 max-w-full flex-col overflow-hidden bg-white/90 backdrop-blur-xl shadow-xl dark:bg-slate-950/90">
            <div className="flex items-center justify-between border-b border-blue-100/60 px-4 py-3 dark:border-slate-700/60">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Menu principal
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Accédez rapidement aux sections
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-label="Fermer la navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full rounded-lg border border-blue-100/60 bg-white/70 py-2 pl-10 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200"
                />
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 pb-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Navigation
                  </p>
                  <div className="space-y-1">
                    {primaryNavigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                            isActive
                              ? 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
                              : 'text-slate-700 hover:bg-blue-50/70 dark:text-slate-300 dark:hover:bg-slate-900/60'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Paramètres
                  </p>
                  <div className="space-y-1">
                    {settingsNavigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                            isActive
                              ? 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
                              : 'text-slate-700 hover:bg-blue-50/70 dark:text-slate-300 dark:hover:bg-slate-900/60'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </nav>

            <div className="border-t border-blue-100/60 p-4 text-sm text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
              Connecté en tant que{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                {name}
              </span>{' '}
              · {role}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
