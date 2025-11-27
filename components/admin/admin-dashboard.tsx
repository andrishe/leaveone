'use client';

import { useState } from 'react';
import { Users, FileText, Settings as SettingsIcon } from 'lucide-react';
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
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Administration
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Gérez votre entreprise et vos employés
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 ${
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
        {activeTab === 'employees' && <EmployeesTab />}
        {activeTab === 'policies' && <PoliciesTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}
