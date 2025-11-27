'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';

type LeavePolicy = {
  id: string;
  name: string;
  description: string | null;
  requiresDocument: boolean;
  maxConsecutiveDays: number | null;
  blackoutDates: string[];
  autoApprovalThreshold: number | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type PolicyFormState = {
  name: string;
  description: string;
  requiresDocument: boolean;
  maxConsecutiveDays: string;
  autoApprovalThreshold: string;
  blackoutDates: string;
  isActive: boolean;
};

const defaultFormState: PolicyFormState = {
  name: '',
  description: '',
  requiresDocument: false,
  maxConsecutiveDays: '',
  autoApprovalThreshold: '',
  blackoutDates: '',
  isActive: true,
};

export function PoliciesTab() {
  const [policies, setPolicies] = useState<LeavePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState<PolicyFormState>(defaultFormState);
  const [editingPolicy, setEditingPolicy] = useState<LeavePolicy | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/policies');

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(
            body?.error || 'Impossible de charger les politiques.'
          );
        }

        const data: LeavePolicy[] = await response.json();
        setPolicies(data);
      } catch (err) {
        console.error('Failed to load policies', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Une erreur est survenue. Réessayez plus tard.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  const activePolicies = useMemo(
    () => policies.filter((policy) => policy.isActive),
    [policies]
  );

  const openCreateForm = () => {
    setFormState(defaultFormState);
    setEditingPolicy(null);
    setShowForm(true);
  };

  const openEditForm = (policy: LeavePolicy) => {
    setFormState({
      name: policy.name,
      description: policy.description ?? '',
      requiresDocument: policy.requiresDocument,
      maxConsecutiveDays: policy.maxConsecutiveDays?.toString() ?? '',
      autoApprovalThreshold: policy.autoApprovalThreshold?.toString() ?? '',
      blackoutDates: policy.blackoutDates.join(', '),
      isActive: policy.isActive,
    });
    setEditingPolicy(policy);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormState(defaultFormState);
    setEditingPolicy(null);
  };

  const upsertPolicy = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      name: formState.name.trim(),
      description: formState.description.trim() || null,
      requiresDocument: formState.requiresDocument,
      maxConsecutiveDays: formState.maxConsecutiveDays
        ? Number(formState.maxConsecutiveDays)
        : null,
      autoApprovalThreshold: formState.autoApprovalThreshold
        ? Number(formState.autoApprovalThreshold)
        : null,
      blackoutDates: formState.blackoutDates
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      isActive: formState.isActive,
    };

    const endpoint = editingPolicy
      ? `/api/policies/${editingPolicy.id}`
      : '/api/policies';
    const method = editingPolicy ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          body?.error || "Impossible d'enregistrer la politique."
        );
      }

      const saved: LeavePolicy = await response.json();

      setPolicies((current) => {
        if (editingPolicy) {
          return current.map((policy) =>
            policy.id === saved.id ? saved : policy
          );
        }

        return [saved, ...current];
      });

      closeForm();
    } catch (err) {
      console.error('Failed to save policy', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de la sauvegarde.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deletePolicy = async (policy: LeavePolicy) => {
    const ask = window.confirm(
      `Supprimer la politique « ${policy.name} » ? Cette action est définitive.`
    );
    if (!ask) return;

    try {
      setDeletingId(policy.id);
      setError(null);
      const response = await fetch(`/api/policies/${policy.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error || 'Suppression impossible.');
      }

      setPolicies((current) =>
        current.filter((existing) => existing.id !== policy.id)
      );
    } catch (err) {
      console.error('Failed to delete policy', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de la suppression.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-slate-600 dark:text-slate-400">
            Administrez les politiques de congés, leurs justificatifs et leurs
            limites.
          </p>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {activePolicies.length} politique
            {activePolicies.length > 1 ? 's' : ''} active
            {activePolicies.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Ajouter une politique
        </button>
      </div>

      {error ? (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Erreur</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Chargement des politiques…
        </div>
      ) : policies.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-10 text-center text-slate-500">
          <p className="font-medium text-slate-700 dark:text-slate-300">
            Aucune politique de congé configurée pour le moment.
          </p>
          <p className="mt-2 text-sm">
            Créez votre première politique pour gérer les justificatifs et les
            plafonds par type de congé.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {policies.map((policy) => {
            const accentClass = policy.requiresDocument
              ? 'bg-amber-500'
              : policy.isActive
                ? 'bg-emerald-500'
                : 'bg-slate-400';

            return (
              <div
                key={policy.id}
                className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${accentClass}`} />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {policy.name}
                      </h3>
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {policy.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      policy.requiresDocument
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300'
                    }`}
                  >
                    {policy.requiresDocument
                      ? 'Justif. requis'
                      : 'Justif. optionnel'}
                  </span>
                </div>

                {policy.description ? (
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                    {policy.description}
                  </p>
                ) : null}

                <dl className="mt-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <dt>Limite consécutive</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">
                      {policy.maxConsecutiveDays
                        ? `${policy.maxConsecutiveDays} jours`
                        : 'Aucune'}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>Auto-approbation</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">
                      {policy.autoApprovalThreshold
                        ? `≤ ${policy.autoApprovalThreshold} jours`
                        : 'Désactivé'}
                    </dd>
                  </div>
                  <div>
                    <dt>Jours de blackout</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">
                      {policy.blackoutDates.length > 0
                        ? policy.blackoutDates
                            .map((date) =>
                              new Date(date).toLocaleDateString('fr-FR')
                            )
                            .join(', ')
                        : 'Aucun'}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:gap-2 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => openEditForm(policy)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 sm:flex-1"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePolicy(policy)}
                    disabled={deletingId === policy.id}
                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {editingPolicy
                    ? 'Modifier la politique'
                    : 'Nouvelle politique'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Définissez les règles de justificatif, de limites et les jours
                  de blackout.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Fermer
              </button>
            </div>

            <form onSubmit={upsertPolicy} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
                  Nom de la politique *
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
                  Description
                </label>
                <textarea
                  value={formState.description}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="Précisez la politique ou les cas où elle s'applique"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
                    Limite de jours consécutifs
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formState.maxConsecutiveDays}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        maxConsecutiveDays: event.target.value,
                      }))
                    }
                    placeholder="Laissez vide pour illimité"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
                    Auto-approbation (jours)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formState.autoApprovalThreshold}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        autoApprovalThreshold: event.target.value,
                      }))
                    }
                    placeholder="Laissez vide pour désactiver"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
                  Jours de blackout
                </label>
                <input
                  type="text"
                  value={formState.blackoutDates}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      blackoutDates: event.target.value,
                    }))
                  }
                  placeholder="Ex : 2024-12-24, 2024-12-31"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Dates séparées par des virgules. Ces jours seront refusés
                  automatiquement.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                <label className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={formState.requiresDocument}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        requiresDocument: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Justificatif obligatoire
                </label>
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={formState.isActive}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        isActive: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Politique active
                </label>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sauvegarde…
                    </>
                  ) : editingPolicy ? (
                    'Enregistrer'
                  ) : (
                    'Créer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
