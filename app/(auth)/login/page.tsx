'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background animated orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      <div className="flex w-full max-w-6xl flex-col items-center gap-12 md:flex-row md:items-center md:justify-between relative z-10">
        {/* Left side - Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md md:w-1/2"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <Briefcase className="w-8 h-8 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <span className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                LeaveOne
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Bienvenue ! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Connectez-vous à votre espace
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative rounded-3xl border border-white/60 bg-white/70 p-8 shadow-2xl shadow-blue-500/10 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/70"
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 5,
                ease: 'easeInOut',
              }}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/80 p-4 dark:border-red-800 dark:bg-red-900/20"
              >
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <div className="relative group">
                  <Mail
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                      emailFocused
                        ? 'text-blue-500'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder="vous@entreprise.com"
                    className="w-full rounded-xl border border-slate-200/80 bg-white/80 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500"
                    required
                    disabled={isLoading}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-blue-500 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: emailFocused ? [0, 0.5, 0] : 0,
                      scale: emailFocused ? [0.95, 1.02, 1] : 0.95,
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Mot de passe
                </label>
                <div className="relative group">
                  <Lock
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                      passwordFocused
                        ? 'text-blue-500'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200/80 bg-white/80 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500"
                    required
                    disabled={isLoading}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-blue-500 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: passwordFocused ? [0, 0.5, 0] : 0,
                      scale: passwordFocused ? [0.95, 1.02, 1] : 0.95,
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </motion.div>

              {/* Submit */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="relative w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Connexion...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </form>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-6 rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 p-4 dark:border-blue-900/40 dark:from-blue-900/20 dark:to-indigo-900/10"
            >
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-300">
                <span className="text-base">🧪</span>
                Comptes de démonstration
              </p>
              <div className="space-y-1.5 text-xs text-blue-800 dark:text-blue-400">
                <p className="font-mono">👤 Admin : jean.dupont@demo.com</p>
                <p className="font-mono">👥 Manager : marie.dubois@demo.com</p>
                <p className="font-mono">📝 Employé : sophie.martin@demo.com</p>
                <p className="text-[11px] text-blue-700 dark:text-blue-500 mt-2">
                  🔑 Mot de passe : <span className="font-semibold">password123</span>
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              ← Retour à l'accueil
            </Link>
          </motion.p>
        </motion.div>

        {/* Right side - Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="hidden md:flex w-full md:w-1/2 justify-center items-center"
        >
          <div className="relative w-full max-w-lg">
            {/* Animated gradient orbs behind illustration */}
            <motion.div
              className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-cyan-400/30 blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-400/30 via-indigo-400/20 to-blue-500/30 blur-3xl"
              animate={{
                scale: [1.1, 1, 1.1],
                rotate: [0, -90, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2,
              }}
            />

            <motion.div
              className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl shadow-blue-500/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
              >
                <Image
                  src="/team.svg"
                  alt="Illustration d'équipe"
                  width={640}
                  height={640}
                  className="mx-auto h-auto w-full drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
