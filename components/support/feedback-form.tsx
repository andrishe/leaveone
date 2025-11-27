'use client';

import { FormEvent, useState } from 'react';
import { Loader2, Send } from 'lucide-react';

const categories = [
  { value: 'question', label: 'Question fonctionnelle' },
  { value: 'incident', label: 'Incident ou bug' },
  { value: 'suggestion', label: 'Suggestion produit' },
  { value: 'autre', label: 'Autre demande' },
];

type FeedbackFormProps = {
  supportEmail: string;
};

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function FeedbackForm({ supportEmail }: FeedbackFormProps) {
  const [category, setCategory] = useState<string>(
    categories[0]?.value ?? 'question'
  );
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [includeDiagnostics, setIncludeDiagnostics] = useState(true);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject) {
      setError('Merci de préciser un objet');
      return;
    }

    if (trimmedSubject.length < 5) {
      setError("L'objet doit contenir au moins 5 caractères");
      return;
    }

    if (!trimmedMessage) {
      setError('Merci de détailler votre demande');
      return;
    }

    if (trimmedMessage.length < 20) {
      setError('Le message doit contenir au moins 20 caractères');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          subject: trimmedSubject,
          message: trimmedMessage,
          includeDiagnostics,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error ?? "Impossible d'envoyer votre message");
      }

      setStatus('success');
      setSubject('');
      setMessage('');
      setIncludeDiagnostics(true);
    } catch (err) {
      setStatus('error');
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer votre message"
      );
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-6 space-y-2">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Envoyer un feedback
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Vous pouvez aussi nous écrire directement sur{' '}
          <a
            href={`mailto:${supportEmail}`}
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {supportEmail}
          </a>
          .
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {isSuccess ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
          Merci pour votre retour ! Nous revenons vers vous dans les plus brefs
          délais.
        </div>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Type de demande
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-700"
            >
              {categories.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Objet
            </label>
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              maxLength={120}
              disabled={isLoading}
              placeholder="Ex. Problème de connexion"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-700"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Message
          </label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            minLength={20}
            rows={6}
            disabled={isLoading}
            placeholder="Décrivez le contexte, les étapes pour reproduire ou votre suggestion."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-700"
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
          <input
            type="checkbox"
            checked={includeDiagnostics}
            disabled={isLoading}
            onChange={(event) => setIncludeDiagnostics(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span>
            Joindre des informations techniques (navigateur, version, URL) pour
            accélérer notre diagnostic.
          </span>
        </label>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isLoading ? 'Envoi en cours...' : 'Envoyer'}
          </button>
        </div>
      </form>
    </div>
  );
}
