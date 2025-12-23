'use client';

import { useEffect, useState } from 'react';
import { MoreHorizontal, Trash2, X, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Leave {
  id: string;
  leaveType: {
    name: string;
    code: string;
    color: string;
  };
  startDate: string;
  endDate: string;
  totalDays: number;
  status: string;
  createdAt: string;
  approver?: {
    name: string;
  } | null;
  rejectedReason?: string | null;
}

const statusConfig = {
  PENDING: {
    label: 'En attente',
    color:
      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  },
  APPROVED: {
    label: 'Approuvé',
    color:
      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  },
  REJECTED: {
    label: 'Refusé',
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  },
  CANCELLED: {
    label: 'Annulé',
    color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  },
};

const filterOptions: Array<{
  value: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';
  label: string;
  activeClass: string;
}> = [
  {
    value: 'ALL',
    label: 'Toutes',
    activeClass: 'bg-blue-600 text-white shadow-sm dark:bg-blue-500',
  },
  {
    value: 'PENDING',
    label: 'En attente',
    activeClass: 'bg-yellow-500 text-white shadow-sm',
  },
  {
    value: 'APPROVED',
    label: 'Approuvées',
    activeClass: 'bg-green-500 text-white shadow-sm',
  },
  {
    value: 'REJECTED',
    label: 'Refusées',
    activeClass: 'bg-red-500 text-white shadow-sm',
  },
];

interface LeavesListProps {
  userId: string;
}

export function LeavesList({ userId }: LeavesListProps) {
  const [filter, setFilter] = useState<
    'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  >('ALL');
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Leave | null>(null);

  useEffect(() => {
    async function fetchLeaves() {
      try {
        const response = await fetch('/api/leaves');
        if (!response.ok) {
          throw new Error('Impossible de charger les congés.');
        }

        const data = await response.json();
        setLeaves(data);
      } catch (err) {
        console.error('Error fetching leaves:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Une erreur est survenue lors du chargement des congés.'
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchLeaves();
  }, []);

  const handleDelete = async (leave: Leave) => {
    setError(null);
    setDeletingId(leave.id);

    try {
      const response = await fetch(`/api/leaves/${leave.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error || 'Suppression impossible.');
      }

      setLeaves((current) => current.filter((item) => item.id !== leave.id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete leave:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de la suppression.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLeaves =
    filter === 'ALL'
      ? leaves
      : leaves.filter((leave) => leave.status === filter);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-slate-200 bg-white p-12 dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="mx-auto mb-4 h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent"
          />
          <p className="text-slate-600 dark:text-slate-400">Chargement...</p>
        </div>
      </motion.div>
    );
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="gap-4 border-b border-slate-200 p-4 sm:p-6 dark:border-slate-700">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-semibold text-slate-900 dark:text-white"
          >
            Mes demandes
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] sm:overflow-visible sm:pb-0"
          >
            <div className="flex w-max items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 shadow-inner dark:border-slate-700 dark:bg-slate-900/40">
              {filterOptions.map((option, index) => {
                const isActive = filter === option.value;
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setFilter(option.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      isActive
                        ? option.activeClass
                        : 'text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    {option.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {filteredLeaves.length > 0 ? (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 p-4 sm:hidden"
          >
            {filteredLeaves.map((leave, index) => {
              const status =
                statusConfig[leave.status as keyof typeof statusConfig];
              const isPending = leave.status === 'PENDING';
              return (
                <motion.div
                  key={leave.id}
                  variants={rowVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: leave.leaveType.color }}
                        ></span>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {leave.leaveType.name}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(leave.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-slate-500 dark:text-slate-400">
                        Période
                      </dt>
                      <dd className="text-right font-medium text-slate-900 dark:text-white">
                        {new Date(leave.startDate).toLocaleDateString('fr-FR')}{' '}
                        - {new Date(leave.endDate).toLocaleDateString('fr-FR')}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-slate-500 dark:text-slate-400">
                        Jours
                      </dt>
                      <dd className="font-semibold text-slate-900 dark:text-white">
                        {leave.totalDays}j
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {isPending ? (
                      <motion.button
                        type="button"
                        onClick={() => setDeleteConfirm(leave)}
                        disabled={deletingId === leave.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/30 dark:text-red-300 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </motion.button>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[720px]">
              <thead>
                <motion.tr
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="border-b border-slate-200 dark:border-slate-700"
                >
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Période
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Jours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Demande créée le
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </motion.tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredLeaves.map((leave, index) => (
                  <motion.tr
                    key={leave.id}
                    variants={rowVariants}
                    whileHover={{
                      backgroundColor: 'rgba(59, 130, 246, 0.05)',
                      transition: { duration: 0.2 },
                    }}
                    className="border-b border-slate-100 dark:border-slate-700"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: leave.leaveType.color }}
                        ></span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {leave.leaveType.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(leave.startDate).toLocaleDateString('fr-FR')} -{' '}
                      {new Date(leave.endDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {leave.totalDays}j
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusConfig[
                            leave.status as keyof typeof statusConfig
                          ].color
                        }`}
                      >
                        {
                          statusConfig[
                            leave.status as keyof typeof statusConfig
                          ].label
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(leave.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {leave.status === 'PENDING' ? (
                          <motion.button
                            type="button"
                            onClick={() => setDeleteConfirm(leave)}
                            disabled={deletingId === leave.id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="rounded p-1.5 text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-900/20"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        ) : null}
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="rounded p-1.5 text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-slate-700"
                          title="Plus d'options"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="px-4 py-10 text-center sm:px-10"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Aucune demande trouvée
          </p>
        </motion.div>
      )}

      {/* Modal de confirmation de suppression */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
            >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Supprimer la demande
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="ml-auto rounded-full p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: deleteConfirm.leaveType.color }}
                ></span>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {deleteConfirm.leaveType.name}
                </p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Du{' '}
                <span className="font-medium">
                  {new Date(deleteConfirm.startDate).toLocaleDateString(
                    'fr-FR'
                  )}
                </span>{' '}
                au{' '}
                <span className="font-medium">
                  {new Date(deleteConfirm.endDate).toLocaleDateString('fr-FR')}
                </span>{' '}
                ({deleteConfirm.totalDays} jour
                {deleteConfirm.totalDays > 1 ? 's' : ''})
              </p>
            </div>

            <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
              Êtes-vous sûr de vouloir supprimer cette demande de congé ? Cette
              action est irréversible.
            </p>

            <div className="flex items-center justify-end gap-3">
              <motion.button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                disabled={deletingId === deleteConfirm.id}
              >
                Annuler
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={deletingId === deleteConfirm.id}
              >
                {deletingId === deleteConfirm.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {deletingId === deleteConfirm.id ? 'Suppression…' : 'Supprimer'}
              </motion.button>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
