'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  LogOut,
  Briefcase,
  LifeBuoy,
} from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';

export type SidebarLink = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const primaryNavigation: SidebarLink[] = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Mes congés', href: '/leaves', icon: Calendar },
  { name: 'Mon équipe', href: '/team', icon: Users },
];

export const settingsNavigation: SidebarLink[] = [
  { name: 'Paramètres', href: '/settings', icon: Settings },
  { name: 'Support', href: '/support', icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  // TODO: Récupérer le vrai solde depuis l'API
  const remainingDays = 18.5;

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="relative hidden h-full flex-col overflow-hidden border-r border-blue-100/60 bg-linear-to-b from-white/90 via-blue-50/60 to-white/90 backdrop-blur-sm dark:border-slate-700/60 dark:from-slate-950/90 dark:via-blue-950/40 dark:to-slate-950/90 lg:flex lg:w-64">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-blue-100/60 bg-white/60 dark:border-slate-700/60 dark:bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-sm">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">
            LeaveOne
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2">
            Navigation
          </p>
          {primaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-100/80 text-blue-700 shadow-sm dark:bg-blue-900/30 dark:text-blue-200'
                    : 'text-slate-700 hover:bg-blue-50/70 dark:text-slate-300 dark:hover:bg-slate-900/60'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2">
            Paramètres
          </p>
          {settingsNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-100/80 text-blue-700 shadow-sm dark:bg-blue-900/30 dark:text-blue-200'
                    : 'text-slate-700 hover:bg-blue-50/70 dark:text-slate-300 dark:hover:bg-slate-900/60'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-100/60 dark:border-slate-700/60">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50/80 dark:hover:bg-red-900/20 w-full transition"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
