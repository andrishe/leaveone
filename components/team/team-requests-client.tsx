'use client';

import { useState } from 'react';
import { Check, X, AlertCircle, Loader2 } from 'lucide-react';

type ActionType = 'approve' | 'reject';

export type TeamRequestItem = {
  id: string;
  employeeName: string;
  employeeEmail: string;
  leaveTypeName: string;
  leaveTypeColor: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  createdAt: string;
  comment: string | null;
};

interface TeamRequestsClientProps {
  initialRequests: TeamRequestItem[];
  isAdmin: boolean;
}

export function TeamRequestsClient({
  initialRequests,
  isAdmin,
}: TeamRequestsClientProps) {
  const [requests, setRequests] = useState<TeamRequestItem[]>(initialRequests);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAction = async (requestId: string, action: ActionType) => {
    let reason: string | undefined;

    if (action === 'reject') {
      const promptValue = window.prompt(
        'Indiquez la raison du refus (obligatoire) :'
      );

      if (promptValue === null) {
        return;
      }

      if (!promptValue.trim()) {
        setError('Une raison est obligatoire pour refuser une demande.');
        return;
      }

      reason = promptValue.trim();
    }

    setActiveId(requestId);
    setError(null);
    setFeedback(null);

    try {
      const response = await fetch(`/api/leaves/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, reason }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || 'Action impossible.');
      }

      setRequests((current) =>
        current.filter((request) => request.id !== requestId)
      );

      setFeedback(
        action === 'approve'
          ? 'Demande approuvée avec succès.'
          : 'Demande refusée avec succès.'
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de la mise à jour.'
      );
    } finally {
      setActiveId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Demandes à valider
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {requests.length} demande
          {requests.length > 1 ? 's' : ''} en attente de validation
          {isAdmin ? ' dans toute l’entreprise' : ''}
        </p>

        {error ? (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Action impossible</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : null}

        {feedback ? (
          <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-300">
            {feedback}
          </p>
        ) : null}
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {requests.length > 0 ? (
          requests.map((request) => {
            const initials = request.employeeName
              .split(' ')
              .map((part) => part[0] ?? '')
              .join('')
              .slice(0, 2)
              .toUpperCase();

            const isProcessing = activeId === request.id;

            return (
              <div
                key={request.id}
                className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {initials || '??'}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {request.employeeName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Demande créée le{' '}
                        {new Date(request.createdAt).toLocaleDateString(
                          'fr-FR'
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    {request.leaveTypeName}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Période
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {new Date(request.startDate).toLocaleDateString('fr-FR')}{' '}
                      - {new Date(request.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Durée
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {request.totalDays} jour
                      {request.totalDays > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {request.comment ? (
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      💬 {request.comment}
                    </p>
                  </div>
                ) : null}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAction(request.id, 'approve')}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {isProcessing ? 'Traitement...' : 'Approuver'}
                  </button>
                  <button
                    onClick={() => handleAction(request.id, 'reject')}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    {isProcessing ? 'Traitement...' : 'Refuser'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Aucune demande en attente
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Toutes les demandes ont été traitées
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
