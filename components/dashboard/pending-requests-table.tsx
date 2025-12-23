'use client';

import { MoreHorizontal, Check, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PendingRequestsTableProps {
  requests: {
    id: string;
    startDate: Date | string;
    endDate: Date | string;
    totalDays: number;
    user: { name: string; email: string };
    leaveType: { name: string };
  }[];
  userRole: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

export function PendingRequestsTable({
  requests,
  userRole,
}: PendingRequestsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-blue-100/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/70"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-semibold text-slate-900 dark:text-white"
          >
            {userRole === 'ADMIN'
              ? "Demandes en attente (toute l'entreprise)"
              : userRole === 'MANAGER'
                ? 'Demandes à valider'
                : 'Mes demandes en attente'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-1 text-sm text-slate-500 dark:text-slate-400"
          >
            {requests.length} demande(s) en attente
          </motion.p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="rounded-lg p-2 transition hover:bg-blue-50/70 dark:hover:bg-slate-900/60"
        >
          <MoreHorizontal className="h-5 w-5 text-blue-500 dark:text-blue-300" />
        </motion.button>
      </div>

      {/* Table */}
      {requests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <motion.tr
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border-b border-slate-200 dark:border-slate-700"
              >
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {userRole === 'MANAGER' ? 'Employé' : 'Type'}
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Période
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Jours
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Statut
                </th>
                {userRole === 'MANAGER' && (
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                )}
              </motion.tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {requests.map((request, index) => (
                <motion.tr
                  key={request.id}
                  variants={rowVariants}
                  whileHover={{
                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                    transition: { duration: 0.2 },
                  }}
                  className="group border-b border-blue-100/40 dark:border-slate-800/40"
                >
                  <td className="py-4">
                    {userRole === 'MANAGER' ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.3 + index * 0.05,
                            type: 'spring',
                            stiffness: 200,
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-600 via-indigo-500 to-cyan-500 text-xs font-semibold text-white shadow-sm"
                        >
                          {request.user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </motion.div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {request.user.name}
                        </span>
                      </div>
                    ) : (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="inline-flex items-center rounded-full bg-blue-100/80 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        {request.leaveType.name}
                      </motion.span>
                    )}
                  </td>
                  <td className="py-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(request.startDate).toLocaleDateString('fr-FR')} -{' '}
                    {new Date(request.endDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-4 text-sm font-medium text-slate-900 dark:text-white">
                    {request.totalDays}j
                  </td>
                  <td className="py-4">
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="inline-flex items-center rounded-full bg-yellow-100/80 px-2.5 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    >
                      En attente
                    </motion.span>
                  </td>
                  {userRole === 'MANAGER' && (
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="rounded bg-linear-to-br from-emerald-500 to-teal-500 p-1.5 text-white transition hover:brightness-110"
                        >
                          <Check className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="rounded bg-linear-to-br from-rose-500 to-red-500 p-1.5 text-white transition hover:brightness-110"
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="py-12 text-center"
        >
          <p className="text-slate-500 dark:text-slate-400">
            Aucune demande en attente
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
