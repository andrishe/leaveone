'use client';

import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

type Leave = {
  id: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  user: { name: string; email: string };
  leaveType?: { name: string; color: string };
};

interface ApprovedLeavesTableProps {
  currentLeaves: Leave[];
  upcomingLeaves: Leave[];
  pastLeaves: Leave[];
}

const formatDateRange = (start: Date, end: Date) => {
  const startStr = start.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
  const endStr = end.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
  return start.getTime() === end.getTime() ? startStr : `${startStr} → ${endStr}`;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
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

function LeaveCard({ leave, index }: { leave: Leave; index: number }) {
  const isCurrentLeave = leave.leaveType?.name === 'En cours';

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -2 }}
      className="flex items-center justify-between rounded-lg border p-3"
      style={{
        backgroundColor: leave.leaveType?.color
          ? `${leave.leaveType.color}10`
          : undefined,
        borderColor: leave.leaveType?.color ?? undefined,
      }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: index * 0.05,
            type: 'spring',
            stiffness: 200,
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{
            backgroundColor: leave.leaveType?.color ?? '#6b7280',
          }}
        >
          {leave.user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
        </motion.div>
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {leave.user.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {leave.leaveType?.name ?? 'Congé'}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {formatDateRange(leave.startDate, leave.endDate)}
        </p>
        <p className="text-xs text-slate-500">
          {leave.totalDays} jour{leave.totalDays > 1 ? 's' : ''}
        </p>
      </div>
    </motion.div>
  );
}

export function ApprovedLeavesTable({
  currentLeaves,
  upcomingLeaves,
  pastLeaves,
}: ApprovedLeavesTableProps) {
  const totalLeaves = currentLeaves.length + upcomingLeaves.length + pastLeaves.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-green-100/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/70"
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
            Congés validés
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-1 text-sm text-slate-500 dark:text-slate-400"
          >
            {currentLeaves.length} en cours · {upcomingLeaves.length} à venir
          </motion.p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          whileHover={{ rotate: 360 }}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30"
        >
          <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
        </motion.div>
      </div>

      {totalLeaves === 0 ? (
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="py-8 text-center text-slate-500 dark:text-slate-400"
        >
          Aucun congé validé
        </motion.p>
      ) : (
        <div className="space-y-4">
          {/* Congés en cours */}
          {currentLeaves.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-3 text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400"
              >
                En cours
              </motion.h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                {currentLeaves.map((leave, index) => (
                  <LeaveCard key={leave.id} leave={leave} index={index} />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Congés à venir */}
          {upcomingLeaves.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-3 mt-4 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400"
              >
                À venir
              </motion.h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                {upcomingLeaves.map((leave, index) => (
                  <LeaveCard key={leave.id} leave={leave} index={index} />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Historique des congés validés */}
          {pastLeaves.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-3 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Historique
              </motion.h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                {pastLeaves.map((leave, index) => (
                  <LeaveCard key={leave.id} leave={leave} index={index} />
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
