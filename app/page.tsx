'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles, Zap, Calendar, Brain, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const { title, highlight, subtitle } = heroCopy;
  const displayedPlans = useMemo(() => pricingPlans, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="fixed top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"
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
        className="fixed bottom-0 left-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <div className="relative pb-24">
        <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-blue-100/80 via-slate-50 to-transparent dark:from-blue-900/40" />

        {/* Navigation */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500 text-white font-bold shadow-lg shadow-blue-500/30">
              L
            </span>
            LeaveOne
          </motion.div>
          <nav className="flex flex-wrap items-center gap-6 text-slate-500 dark:text-slate-400">
            {navigation.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ scale: 1.05, color: '#2563eb' }}
                className="transition-colors"
              >
                {item.label}
              </motion.a>
            ))}
          </nav>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 text-sm"
          >
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105"
            >
              Accéder à mon espace
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.header>

        {/* Hero */}
        <section className="container mx-auto px-4 mt-16">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-sm font-semibold tracking-wide text-blue-600 shadow-sm ring-1 ring-blue-100 dark:from-blue-500/20 dark:to-indigo-500/20 dark:text-blue-200 dark:ring-blue-500/30"
              >
                <Sparkles className="w-4 h-4" />
                Gestion des absences nouvelle génération
              </motion.p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 text-5xl font-bold leading-tight sm:text-6xl md:text-7xl"
            >
              {title}{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                {highlight}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 px-8 py-4 font-semibold text-white shadow-xl shadow-blue-600/30 transition-all hover:shadow-2xl hover:shadow-blue-600/40"
                >
                  Démarrer gratuitement
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#pricing"
                  className="inline-flex items-center gap-3 rounded-full border-2 border-slate-200 px-8 py-4 font-semibold text-slate-600 transition-all hover:border-blue-600 hover:text-blue-600 hover:shadow-lg dark:border-slate-700 dark:text-slate-300"
                >
                  Voir les tarifs
                </Link>
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-sm text-slate-500 flex flex-wrap items-center justify-center gap-4"
            >
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-600" />
                Sans carte bancaire
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-600" />
                Installation en 10 minutes
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-600" />
                Support humain en français
              </span>
            </motion.p>
          </div>
        </section>
      </div>

      {/* Feature highlights */}
      <section id="features" className="container mx-auto px-4 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Une solution complète pour une gestion moderne des absences
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featureHighlights.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/60 p-6 shadow-sm transition-all hover:shadow-xl hover:border-blue-200 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 text-2xl"
              >
                {feature.iconComponent}
              </motion.div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                initial={{ opacity: 0 }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative mt-32 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/70 via-white to-white dark:from-slate-900/60 dark:via-slate-950/80 dark:to-slate-950" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1.5 text-sm font-semibold shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`relative whitespace-nowrap rounded-full px-5 py-2.5 transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-300'
                }`}
              >
                Annuel{' '}
                {billingCycle === 'annual' && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300"
                  >
                    -20%
                  </motion.span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-300'
                }`}
              >
                Mensuel
              </button>
            </motion.div>

            <h2 className="mt-10 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Choisissez la formule qui grandit avec votre équipe
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Des tarifs transparents, résiliables à tout moment. Les intégrations et le support premium sont
              inclus dès le plan Growth.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {displayedPlans.map((plan, i) => {
              const isPopular = plan.popular;
              const priceLabel = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
              const comparedPrice = billingCycle === 'annual' ? plan.monthlyPrice : null;

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`relative flex flex-col rounded-3xl border p-8 shadow-xl transition-all ${
                    isPopular
                      ? 'border-transparent bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500 text-white shadow-blue-600/40 scale-105'
                      : 'border-slate-200 bg-white hover:border-blue-200 dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  {isPopular && (
                    <motion.span
                      initial={{ scale: 0, y: 20 }}
                      whileInView={{ scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg"
                    >
                      ⭐ Populaire
                    </motion.span>
                  )}

                  <div className="mb-6">
                    <h3
                      className={`text-2xl font-bold ${
                        isPopular ? 'text-white' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p className={`mt-2 text-sm ${isPopular ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="mb-6 flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${isPopular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      €{priceLabel}
                    </span>
                    <span className={`text-sm ${isPopular ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      /{billingCycle === 'annual' ? 'mois (facturé annuellement)' : 'mois'}
                    </span>
                  </div>

                  {comparedPrice ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`mb-6 text-xs font-semibold uppercase tracking-wide ${
                        isPopular ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-300'
                      }`}
                    >
                      {comparedPrice} €/mois en mensuel — économisez 20%
                    </motion.p>
                  ) : (
                    <div className="mb-6 h-4" />
                  )}

                  <p className={`mb-8 text-sm ${isPopular ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'}`}>
                    {plan.description}
                  </p>

                  <ul className={`mb-8 space-y-3 text-sm ${isPopular ? 'text-blue-50' : 'text-slate-600 dark:text-slate-300'}`}>
                    {plan.features.map((feature, j) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <span
                          className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            isPopular
                              ? 'bg-white/20 border border-white/40 text-white'
                              : 'bg-blue-50 border border-blue-200 text-blue-600 dark:bg-blue-900/30 dark:border-blue-500/40 dark:text-blue-200'
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="mt-auto">
                    <Link
                      href="/login"
                      className={`group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all ${
                        isPopular
                          ? 'bg-white text-blue-600 shadow-lg hover:shadow-xl'
                          : 'border-2 border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-blue-900/20'
                      }`}
                    >
                      Choisir {plan.name}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-4"
          >
            <span>🔒 Paiement sécurisé via Stripe</span>
            <span>·</span>
            <span>✓ Annulation à tout moment</span>
            <span>·</span>
            <span>💬 Support humain prioritaire</span>
          </motion.p>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="container mx-auto mt-32 px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-800 to-blue-600 px-8 py-20 text-white shadow-2xl dark:from-blue-700 dark:via-blue-600 dark:to-cyan-500"
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold tracking-tight md:text-5xl"
            >
              Simplifiez la gestion des congés dès aujourd'hui
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-blue-100"
            >
              Déployez LeaveOne auprès de votre équipe en moins d'une heure et offrez une expérience moderne à
              vos collaborateurs.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-slate-900 shadow-xl transition-all hover:bg-slate-100"
                >
                  Démarrer gratuitement
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <Link
                href="/support"
                className="text-sm font-medium text-blue-100 underline-offset-4 hover:text-white transition-colors hover:underline"
              >
                Parler à nos experts
              </Link>
            </motion.div>
          </div>
        </motion.div>
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
    iconComponent: <Zap className="w-6 h-6" />,
  },
  {
    title: 'Vue calendrier unifiée',
    description:
      "Repérez instantanément les chevauchements grâce à un calendrier partagé pour toute l'entreprise.",
    icon: '📅',
    iconComponent: <Calendar className="w-6 h-6" />,
  },
  {
    title: 'Workflow intelligent',
    description:
      'Rappels automatiques, relances personnalisées et approbations multi-niveaux en quelques clics.',
    icon: '🧠',
    iconComponent: <Brain className="w-6 h-6" />,
  },
  {
    title: 'Sécurité & conformité',
    description:
      'Infrastructure européenne, conformité RGPD et contrôles d\'accès fins pour vos managers.',
    icon: '🔐',
    iconComponent: <Shield className="w-6 h-6" />,
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
      'L'essentiel pour digitaliser les demandes d'absence et gagner du temps sur le suivi.',
    features: [
      'Jusqu'à 20 collaborateurs',
      'Demandes illimitées',
      'Calendrier partagé',
      'Workflows d'approbation simples',
      'Support par email',
    ],
  },
  {
    name: 'Growth',
    monthlyPrice: 59,
    annualPrice: 49,
    tagline: 'Pour les PME et organisations en croissance',
    description:
      'Centralisez l'ensemble de vos politiques de congés et offrez une expérience moderne à vos managers.',
    features: [
      'Jusqu'à 100 collaborateurs',
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
