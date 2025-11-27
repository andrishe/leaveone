'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL: '/dashboard',
      });

      if (result.error) {
        setError(result.error.message || 'Email ou mot de passe incorrect');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white/90 via-blue-50/70 to-white/20 dark:from-slate-950 dark:via-blue-950/40 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl flex-col items-center gap-10 md:flex-row md:items-stretch md:justify-between">
        <div className="w-full max-w-md md:w-1/2 md:max-w-none">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                LeaveOne
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Connexion
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Accédez à votre espace de gestion des congés
            </p>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-blue-100/60 bg-white/80 p-8 shadow-2xl shadow-blue-500/10 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/80">
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200/80 bg-red-50/80 p-4 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 dark:text-red-300">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@entreprise.com"
                    className="w-full rounded-lg border border-blue-100/60 bg-white/70 py-2.5 pl-10 pr-4 text-slate-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-blue-100/60 bg-white/70 py-2.5 pl-10 pr-4 text-slate-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-linear-to-r from-blue-600 via-indigo-500 to-cyan-500 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 rounded-lg border border-blue-200/60 bg-blue-50/80 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
              <p className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-300">
                🧪 Comptes de démonstration :
              </p>
              <div className="space-y-1 text-xs text-blue-800 dark:text-blue-400">
                <p>Admin : jean.dupont@demo.com / password123</p>
                <p>Manager : marie.dubois@demo.com / password123</p>
                <p>Employé : sophie.martin@demo.com / password123</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            <Link
              href="/"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-300"
            >
              ← Retour à l'accueil
            </Link>
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-linear-to-br from-blue-500/30 via-indigo-500/20 to-cyan-400/30 blur-3xl" />
            <div className="absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-linear-to-br from-cyan-400/30 via-indigo-400/20 to-blue-500/30 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl shadow-blue-500/20">
              <Image
                src="/team.svg"
                alt="Illustration d'équipe"
                width={640}
                height={640}
                className="mx-auto h-auto w-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
