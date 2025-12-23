'use client';

import { useState } from 'react';
import { Users, FileText, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmployeesTab } from '@/components/admin/employees-tab';
import { PoliciesTab } from '@/components/admin/policies-tab';
import { SettingsTab } from '@/components/admin/settings-tab';

const tabs = [
  { id: 'employees', label: 'Employés', icon: Users },
  { id: 'policies', label: 'Politiques de congés', icon: FileText },
  { id: 'settings', label: 'Paramètres', icon: SettingsIcon },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('employees');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-linear-to-br from-blue-50 via-indigo-50/50 to-cyan-50/30 p-8 shadow-lg dark:border-slate-800/60 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40"
      >
        {/* Decorative gradient orbs */}
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-2 bg-linear-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:via-blue-100 dark:to-indigo-100"
          >
            Administration
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-slate-700 dark:text-slate-300"
          >
            Gérez votre entreprise et vos employés
          </motion.p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="border-b border-slate-200 dark:border-slate-700"
      >
        <div className="flex gap-4">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className={`relative flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 ${
                  isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 -bottom-0.5 border-b-2 border-blue-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'employees' && <EmployeesTab />}
          {activeTab === 'policies' && <PoliciesTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
