'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export default function Home() {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>(
    'annual'
  );

  const { title, highlight, subtitle } = heroCopy;
  const displayedPlans = useMemo(() => pricingPlans, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-slate-100 to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="relative pb-24">
        <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-linear-to-b from-blue-100/80 via-slate-50 to-transparent dark:from-blue-900/40" />
        <div className="absolute -right-48 -top-24 -z-10 h-72 w-72 rounded-full bg-linear-to-br from-blue-400/30 via-slate-200/40 to-transparent blur-3xl dark:from-blue-500/20 dark:via-blue-900/20" />

        {/* Navigation */}
        <header className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
              L
            </span>
            LeaveOne
          </div>
          <nav className="flex flex-wrap items-center gap-6 text-slate-500 dark:text-slate-400">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-blue-600"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Accéder à mon espace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide uppercase text-blue-600 shadow-sm ring-1 ring-blue-100 dark:bg-blue-500/20 dark:text-blue-200">
              Gestion des absences nouvelle génération
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              {title}{' '}
              <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                {highlight}
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
              {subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link
                href="/login"
                className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Démarrer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center gap-3 rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-600 transition hover:border-blue-600 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300"
              >
                Voir les tarifs
              </Link>
            </div>
            <p className="mt-5 text-xs text-slate-500">
              Sans carte bancaire • Installation en 10 minutes • Support humain
              en français
            </p>
          </div>
        </section>
      </div>

      {/* Feature highlights */}
      <section id="features" className="container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featureHighlights.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-blue-50/60 p-6 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-linear-to-br dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative mt-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-blue-50/70 via-white to-white dark:from-slate-900/60 dark:via-slate-950/80 dark:to-slate-950" />
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 text-xs font-semibold shadow-md dark:border-slate-800 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`whitespace-nowrap rounded-full px-4 py-2 transition ${
                  billingCycle === 'annual'
                    ? 'bg-slate-900 text-white shadow dark:bg-blue-500'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-300'
                }`}
              >
                Annuel{' '}
                <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                  -20%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`whitespace-nowrap rounded-full px-4 py-2 transition ${
                  billingCycle === 'monthly'
                    ? 'bg-slate-900 text-white shadow dark:bg-blue-500'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-300'
                }`}
              >
                Mensuel
              </button>
            </div>
            <h2 className="mt-8 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Choisissez la formule qui grandit avec votre équipe
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
              Des tarifs transparents, résiliables à tout moment. Les
              intégrations et le support premium sont inclus dès le plan Growth.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {displayedPlans.map((plan) => {
              const isPopular = plan.popular;
              const priceLabel =
                billingCycle === 'annual'
                  ? plan.annualPrice
                  : plan.monthlyPrice;
              const comparedPrice =
                billingCycle === 'annual' ? plan.monthlyPrice : null;

              return (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-3xl border bg-white p-8 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-900 ${
                    isPopular
                      ? 'border-transparent bg-linear-to-br from-blue-600 via-indigo-500 to-cyan-500 text-white shadow-blue-600/30'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {isPopular ? (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 shadow-sm">
                      Populaire
                    </span>
                  ) : null}
                  <div className="mb-6">
                    <h3
                      className={`text-lg font-semibold ${
                        isPopular
                          ? 'text-white'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`mt-2 text-sm ${
                        isPopular
                          ? 'text-blue-100'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="mb-6 flex items-baseline gap-3">
                    <span
                      className={`text-4xl font-bold ${
                        isPopular
                          ? 'text-white'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      €{priceLabel}
                    </span>
                    <span
                      className={`text-sm ${
                        isPopular
                          ? 'text-blue-100'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      /
                      {billingCycle === 'annual'
                        ? 'mois (facturé annuellement)'
                        : 'mois'}
                    </span>
                  </div>
                  {comparedPrice ? (
                    <p
                      className={`mb-6 text-xs font-semibold uppercase tracking-wide ${
                        isPopular
                          ? 'text-emerald-200'
                          : 'text-emerald-600 dark:text-emerald-300'
                      }`}
                    >
                      {comparedPrice} €/mois en mensuel — économisez 20%
                    </p>
                  ) : (
                    <div className="mb-6 h-4" />
                  )}

                  <p
                    className={`mb-6 text-sm ${
                      isPopular
                        ? 'text-blue-100'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {plan.description}
                  </p>

                  <ul
                    className={`mb-8 space-y-3 text-sm ${
                      isPopular
                        ? 'text-blue-50'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span
                          className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border bg-white text-blue-600 dark:border-blue-500/40 dark:bg-blue-900/30 dark:text-blue-200 ${
                            isPopular
                              ? 'border-white/40 bg-white/10 text-white'
                              : 'border-blue-200'
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/login"
                    className={`mt-auto inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                      isPopular
                        ? 'bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-blue-900/20 hover:brightness-110'
                        : 'border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600 dark:border-slate-700 dark:text-slate-200'
                    }`}
                  >
                    Choisir {plan.name}
                  </Link>
                </div>
              );
            })}
          </div>

          <p className="mt-10 text-center text-xs text-slate-500 dark:text-slate-400">
            Paiement sécurisé via Stripe · Annulation à tout moment · Support
            humain prioritaire
          </p>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="container mx-auto mt-24 px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-blue-800 to-blue-500 px-8 py-16 text-white shadow-2xl dark:from-blue-700 dark:via-blue-600 dark:to-cyan-500">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-linear-to-l from-white/20 to-transparent md:block" />
          <div className="relative z-10 mx-auto max-w-2xl text-center md:text-left">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Simplifiez la gestion des congés dès aujourd'hui
            </h2>
            <p className="mt-4 text-base text-blue-100">
              Déployez LeaveOne auprès de votre équipe en moins d'une heure et
              offrez une expérience moderne à vos collaborateurs.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row md:justify-start">
              <Link
                href="/login"
                className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Démarrer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/support"
                className="text-sm font-medium text-blue-100 underline-offset-4 transition hover:text-white"
              >
                Parler à nos experts
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const navigation = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Tarifs', href: '#pricing' },
  { label: 'Contact', href: '#cta' },
];

const heroCopy = {
  title: 'Choisissez un plan qui',
  highlight: 'grandit avec votre entreprise',
  subtitle:
    'LeaveOne automatise la gestion des congés, simplifie les validations et offre à vos équipes une visibilité claire sur les absences.',
};

const featureHighlights = [
  {
    title: 'Activation éclair',
    description:
      "Importez vos équipes, définissez vos règles et ouvrez les demandes en moins d'une heure.",
    icon: '⚡',
  },
  {
    title: 'Vue calendrier unifiée',
    description:
      "Repérez instantanément les chevauchements grâce à un calendrier partagé pour toute l'entreprise.",
    icon: '📅',
  },
  {
    title: 'Workflow intelligent',
    description:
      'Rappels automatiques, relances personnalisées et approbations multi-niveaux en quelques clics.',
    icon: '🧠',
  },
  {
    title: 'Sécurité & conformité',
    description:
      'Infrastructure européenne, conformité RGPD et contrôles d’accès fins pour vos managers.',
    icon: '🔐',
  },
];

type PricingPlan = {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  tagline: string;
  description: string;
  features: string[];
  popular?: boolean;
};

const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    monthlyPrice: 25,
    annualPrice: 19,
    tagline: 'Pour les petites équipes et startups',
    description:
      'L’essentiel pour digitaliser les demandes d’absence et gagner du temps sur le suivi.',
    features: [
      'Jusqu’à 20 collaborateurs',
      'Demandes illimitées',
      'Calendrier partagé',
      'Workflows d’approbation simples',
      'Support par email',
    ],
  },
  {
    name: 'Growth',
    monthlyPrice: 59,
    annualPrice: 49,
    tagline: 'Pour les PME et organisations en croissance',
    description:
      'Centralisez l’ensemble de vos politiques de congés et offrez une expérience moderne à vos managers.',
    features: [
      'Jusqu’à 100 collaborateurs',
      'Politiques et quotas avancés',
      'Relances et rappels automatiques',
      'Exports CSV & intégrations calendriers',
      'Support prioritaire & onboarding assisté',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    monthlyPrice: 119,
    annualPrice: 99,
    tagline: 'Pour les grandes organisations & groupes multi-sites',
    description:
      'Des fonctionnalités avancées, des rôles granulaires et un accompagnement dédié pour vos enjeux internationaux.',
    features: [
      'Collaborateurs illimités',
      'Approvals multi-niveaux',
      'Intégrations SSO et API',
      'Rapports & analytics avancés',
      'Customer success dédié',
    ],
  },
];
