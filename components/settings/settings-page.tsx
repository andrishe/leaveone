'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import {
  Users,
  FileText,
  Settings as SettingsIcon,
  Building,
} from 'lucide-react';
import { EmployeesTab } from '@/components/admin/employees-tab';
import { PoliciesTab } from '@/components/admin/policies-tab';
import { SettingsTab } from '@/components/admin/settings-tab';

const tabs = [
  { id: 'company', label: 'Entreprise', icon: Building },
  { id: 'employees', label: 'Employés', icon: Users },
  { id: 'policies', label: 'Politiques de congés', icon: FileText },
  { id: 'settings', label: 'Paramètres', icon: SettingsIcon },
];

type PlanName = 'TRIAL' | 'STARTER' | 'BUSINESS' | 'ENTERPRISE';

type PlanOption = {
  id: PlanName;
  label: string;
  prices: {
    MONTHLY: string;
    YEARLY: string;
  };
  description: string;
  limit: number | null;
  limitLabel: string;
};

const planCatalog: PlanOption[] = [
  {
    id: 'TRIAL',
    label: 'Plan Découverte',
    prices: {
      MONTHLY: '0€/mois',
      YEARLY: '0€/an',
    },
    description: '14 jours gratuits pour tester toutes les fonctionnalités.',
    limit: 10,
    limitLabel: "Jusqu'à 10 collaborateurs",
  },
  {
    id: 'STARTER',
    label: 'Starter',
    prices: {
      MONTHLY: '25€/mois',
      YEARLY: '19€/mois',
    },
    description:
      "L'essentiel pour digitaliser les demandes d'absence et gagner du temps sur le suivi.",
    limit: 20,
    limitLabel: "Jusqu'à 20 collaborateurs",
  },
  {
    id: 'BUSINESS',
    label: 'Growth',
    prices: {
      MONTHLY: '59€/mois',
      YEARLY: '49€/mois',
    },
    description:
      "Centralisez l'ensemble de vos politiques de congés et offrez une expérience moderne à vos managers.",
    limit: 100,
    limitLabel: "Jusqu'à 100 collaborateurs",
  },
  {
    id: 'ENTERPRISE',
    label: 'Enterprise',
    prices: {
      MONTHLY: '119€/mois',
      YEARLY: '99€/mois',
    },
    description:
      'Des fonctionnalités avancées, des rôles granulaires et un accompagnement dédié pour vos enjeux internationaux.',
    limit: null,
    limitLabel: 'Collaborateurs illimités',
  },
];

const planDictionary = planCatalog.reduce<Record<PlanName, PlanOption>>(
  (acc, option) => {
    acc[option.id] = option;
    return acc;
  },
  {} as Record<PlanName, PlanOption>
);

const checkoutEligiblePlans = new Set<PlanName>([
  'STARTER',
  'BUSINESS',
  'ENTERPRISE',
]);

export function SettingsPageContent() {
  const [activeTab, setActiveTab] = useState('company');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Paramètres
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Gérez votre entreprise, vos employés et vos préférences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'company' && <CompanyTab />}
        {activeTab === 'employees' && <EmployeesTab />}
        {activeTab === 'policies' && <PoliciesTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

function CompanyTab() {
  const [form, setForm] = useState({
    name: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    plan: 'STARTER' as PlanName,
  });
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [planSaving, setPlanSaving] = useState(false);
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const [billingInterval, setBillingInterval] = useState<'MONTHLY' | 'YEARLY'>(
    'MONTHLY'
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCompany = async () => {
      try {
        const response = await fetch('/api/company', { cache: 'no-store' });
        const payload = await response.json().catch(() => null);

        if (!isMounted) {
          return;
        }

        if (!response.ok) {
          throw new Error(
            payload?.error ??
              "Impossible de charger les informations de l'entreprise"
          );
        }

        setForm({
          name: payload?.name ?? '',
          contactEmail: payload?.contactEmail ?? '',
          contactPhone: payload?.contactPhone ?? '',
          address: payload?.address ?? '',
          plan: (payload?.plan ?? 'STARTER') as PlanName,
        });
        setEmployeeCount(payload?.employeeCount ?? 0);
        setError(null);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger les informations de l'entreprise"
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadCompany();

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

  const handleInputChange =
    (field: 'name' | 'contactEmail' | 'contactPhone' | 'address') =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setForm((previous) => ({ ...previous, [field]: value }));
      if (error) {
        setError(null);
      }
    };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Le nom de l'entreprise est requis");
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
          name: form.name,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone,
          address: form.address,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.error ?? "Impossible d'enregistrer les modifications"
        );
      }

      setForm((previous) => ({
        ...previous,
        name: payload?.name ?? previous.name,
        contactEmail: payload?.contactEmail ?? '',
        contactPhone: payload?.contactPhone ?? '',
        address: payload?.address ?? '',
        plan: (payload?.plan ?? previous.plan) as PlanName,
      }));
      setEmployeeCount(payload?.employeeCount ?? employeeCount);
      setMessage('Modifications enregistrées');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer les modifications"
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePlanUpdate = async (newPlan: PlanName) => {
    console.log('handlePlanUpdate', { newPlan, billingInterval });

    if (newPlan === form.plan) {
      setShowPlanPicker(false);
      return;
    }

    if (checkoutEligiblePlans.has(newPlan)) {
      setPlanSaving(true);
      setMessage(null);
      setError(null);
      setShowPlanPicker(false);

      try {
        console.log('Calling /api/billing/checkout...');
        const response = await fetch('/api/billing/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: newPlan, interval: billingInterval }),
        });

        const payload = await response.json().catch(() => null);
        console.log('Checkout API response:', {
          status: response.status,
          payload,
        });

        if (!response.ok) {
          throw new Error(
            payload?.error ?? 'Impossible de démarrer le paiement'
          );
        }

        if (!payload?.url || typeof payload.url !== 'string') {
          throw new Error('URL de paiement invalide renvoyée par le serveur');
        }

        console.log('Redirecting to Stripe:', payload.url);
        window.location.href = payload.url;
        return;
      } catch (err) {
        console.error('Checkout error:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de démarrer le paiement'
        );
        setPlanSaving(false);
        setShowPlanPicker(true);
        return;
      }
    }

    setPlanSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error ?? 'Impossible de modifier le plan');
      }

      setForm((previous) => ({
        ...previous,
        plan: (payload?.plan ?? newPlan) as PlanName,
      }));
      setEmployeeCount(payload?.employeeCount ?? employeeCount);
      setMessage('Plan mis à jour');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Impossible de modifier le plan'
      );
    } finally {
      setPlanSaving(false);
      setShowPlanPicker(false);
    }
  };

  const currentPlan = planDictionary[form.plan] ?? planCatalog[0];
  const employeesDisplay = loading
    ? '—'
    : currentPlan.limit
      ? `${employeeCount} / ${currentPlan.limit}`
      : `${employeeCount}`;
  const planButtonDisabled = loading || planSaving;
  const saveDisabled = loading || saving;

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
          {message}
        </div>
      ) : null}

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
          Informations de l'entreprise
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleInputChange('name')}
              disabled={saveDisabled}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-700"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email de contact
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={handleInputChange('contactEmail')}
                disabled={saveDisabled}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-700"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Téléphone
              </label>
              <input
                type="tel"
                value={form.contactPhone}
                onChange={handleInputChange('contactPhone')}
                disabled={saveDisabled}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-700"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Adresse
            </label>
            <textarea
              rows={3}
              value={form.address}
              onChange={handleInputChange('address')}
              disabled={saveDisabled}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-700"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
          Abonnement
        </h3>

        <div className="flex flex-col gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
              {currentPlan.label}
            </p>
            <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
              {currentPlan.prices[billingInterval]} • {currentPlan.limitLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowPlanPicker((previous) => !previous);
              setError(null);
            }}
            disabled={planButtonDisabled}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
          >
            {planSaving
              ? 'Mise à jour...'
              : showPlanPicker
                ? 'Fermer'
                : 'Modifier le plan'}
          </button>
        </div>

        {showPlanPicker ? (
          <div className="mt-4 space-y-4">
            <div className="flex justify-center">
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setBillingInterval('MONTHLY')}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                    billingInterval === 'MONTHLY'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  Mensuel
                </button>
                <button
                  type="button"
                  onClick={() => setBillingInterval('YEARLY')}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                    billingInterval === 'YEARLY'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  Annuel (-20%)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {planCatalog.map((option) => {
                const isActive = option.id === form.plan;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => void handlePlanUpdate(option.id)}
                    disabled={planSaving}
                    className={`rounded-lg border p-4 text-left transition ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-300 dark:bg-blue-900/20'
                        : 'border-slate-200 hover:border-blue-400 dark:border-slate-700 dark:hover:border-blue-500'
                    } ${planSaving ? 'opacity-70' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {option.label}
                      </span>
                      {isActive ? (
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-300">
                          Plan actuel
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                      {option.prices[billingInterval]}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {option.description}
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {option.limitLabel}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Employés
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {employeesDisplay}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prochaine facturation
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              —
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveDisabled}
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );
}
