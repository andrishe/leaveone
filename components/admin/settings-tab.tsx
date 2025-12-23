'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Save, Calendar, Bell, Palette, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ThemeOption = 'light' | 'dark' | 'system';

const workingDayOptions = [
  { label: 'Lundi', value: 1 },
  { label: 'Mardi', value: 2 },
  { label: 'Mercredi', value: 3 },
  { label: 'Jeudi', value: 4 },
  { label: 'Vendredi', value: 5 },
  { label: 'Samedi', value: 6 },
  { label: 'Dimanche', value: 7 },
];

const defaultWorkingDays = [1, 2, 3, 4, 5];

export function SettingsTab() {
  const [workingDays, setWorkingDays] = useState<number[]>(defaultWorkingDays);
  const [notifications, setNotifications] = useState({
    newRequestEmail: true,
    pendingReminder: true,
    push: false,
  });
  const [defaultTheme, setDefaultTheme] = useState<ThemeOption>('system');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const workingDaySet = useMemo(() => new Set(workingDays), [workingDays]);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const response = await fetch('/api/company', { cache: 'no-store' });
        const payload = await response.json().catch(() => null);

        if (!isMounted) {
          return;
        }

        if (!response.ok) {
          throw new Error(
            payload?.error ?? 'Impossible de récupérer les préférences'
          );
        }

        if (Array.isArray(payload?.workingDays) && payload.workingDays.length) {
          const sanitized = payload.workingDays
            .map((value: unknown) => Number.parseInt(String(value), 10))
            .filter((value: number) => Number.isInteger(value));

          const uniqueSorted = Array.from(new Set<number>(sanitized)).sort(
            (a, b) => a - b
          );

          setWorkingDays(uniqueSorted);
        } else {
          setWorkingDays(defaultWorkingDays);
        }

        setNotifications({
          newRequestEmail:
            typeof payload?.notificationNewRequestEmail === 'boolean'
              ? payload.notificationNewRequestEmail
              : true,
          pendingReminder:
            typeof payload?.notificationPendingReminder === 'boolean'
              ? payload.notificationPendingReminder
              : true,
          push:
            typeof payload?.notificationPush === 'boolean'
              ? payload.notificationPush
              : false,
        });

        setDefaultTheme(
          typeof payload?.defaultTheme === 'string'
            ? (payload.defaultTheme as ThemeOption)
            : 'system'
        );

        setError(null);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de récupérer les préférences'
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }
    const timer = window.setTimeout(() => setMessage(null), 4000);
    return () => window.clearTimeout(timer);
  }, [message]);

  const handleWorkingDayChange = (value: number) => {
    setWorkingDays((previous) => {
      const set = new Set(previous);
      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }
      const sorted = Array.from(set).sort((a, b) => a - b);
      if (!sorted.length) {
        return previous;
      }
      return sorted;
    });

    if (error) {
      setError(null);
    }
  };

  const handleNotificationChange =
    (key: 'newRequestEmail' | 'pendingReminder' | 'push') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      setNotifications((previous) => ({ ...previous, [key]: checked }));
      if (error) {
        setError(null);
      }
    };

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as ThemeOption;
    setDefaultTheme(value);
    if (error) {
      setError(null);
    }
  };

  const handleSave = async () => {
    if (!workingDays.length) {
      setError('Veuillez sélectionner au moins un jour ouvré');
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workingDays,
          notificationNewRequestEmail: notifications.newRequestEmail,
          notificationPendingReminder: notifications.pendingReminder,
          notificationPush: notifications.push,
          defaultTheme,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error ?? 'Impossible de sauvegarder');
      }

      if (Array.isArray(payload?.workingDays) && payload.workingDays.length) {
        const sanitized = payload.workingDays
          .map((value: unknown) => Number.parseInt(String(value), 10))
          .filter((value: number) => Number.isInteger(value));

        const uniqueSorted = Array.from(new Set<number>(sanitized)).sort(
          (a, b) => a - b
        );

        setWorkingDays(uniqueSorted);
      }
      setNotifications({
        newRequestEmail:
          typeof payload?.notificationNewRequestEmail === 'boolean'
            ? payload.notificationNewRequestEmail
            : notifications.newRequestEmail,
        pendingReminder:
          typeof payload?.notificationPendingReminder === 'boolean'
            ? payload.notificationPendingReminder
            : notifications.pendingReminder,
        push:
          typeof payload?.notificationPush === 'boolean'
            ? payload.notificationPush
            : notifications.push,
      });
      setDefaultTheme(
        typeof payload?.defaultTheme === 'string'
          ? (payload.defaultTheme as ThemeOption)
          : defaultTheme
      );

      setMessage('Préférences mises à jour');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Impossible de sauvegarder'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-12"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"
          />
          <p className="text-slate-600 dark:text-slate-400">
            Chargement des paramètres...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300"
          >
            {error}
          </motion.div>
        )}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="mb-6 flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30"
          >
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Semaine de travail
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sélectionnez les jours ouvrés de votre entreprise
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {workingDayOptions.map((option, index) => (
            <motion.label
              key={option.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={workingDaySet.has(option.value)}
                disabled={loading || saving}
                onChange={() => handleWorkingDayChange(option.value)}
                className="h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {option.label}
              </span>
            </motion.label>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="mb-6 flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30"
          >
            <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Notifications
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Configurez vos préférences de notifications
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <motion.label
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ x: 4 }}
            className="flex items-center justify-between cursor-pointer"
          >
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Email pour nouvelles demandes
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Recevoir un email quand un employé fait une demande
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.newRequestEmail}
              disabled={loading || saving}
              onChange={handleNotificationChange('newRequestEmail')}
              className="h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
          </motion.label>
          <motion.label
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ x: 4 }}
            className="flex items-center justify-between cursor-pointer"
          >
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Rappels demandes non traitées
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Rappel après 48h si une demande n'est pas validée
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.pendingReminder}
              disabled={loading || saving}
              onChange={handleNotificationChange('pendingReminder')}
              className="h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
          </motion.label>
          <motion.label
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ x: 4 }}
            className="flex items-center justify-between cursor-pointer"
          >
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Notifications push navigateur
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Recevoir des notifications même quand l'application est fermée
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.push}
              disabled={loading || saving}
              onChange={handleNotificationChange('push')}
              className="h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
          </motion.label>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="mb-6 flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30"
          >
            <Palette className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Apparence
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Personnalisez le thème de l'application
            </p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Thème par défaut
          </label>
          <select
            value={defaultTheme}
            onChange={handleThemeChange}
            disabled={loading || saving}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-700"
          >
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
            <option value="system">Système</option>
          </select>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-end"
      >
        <motion.button
          type="button"
          onClick={handleSave}
          disabled={loading || saving}
          whileHover={{ scale: saving ? 1 : 1.02 }}
          whileTap={{ scale: saving ? 1 : 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Enregistrer les modifications
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
