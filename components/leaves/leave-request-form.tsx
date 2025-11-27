'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Info } from 'lucide-react';
import { calculateBusinessDays, DEFAULT_WORKING_DAYS } from '@/lib/utils';

const WEEKDAY_LABELS = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
];

type LeavePolicySummary = {
  id: string;
  name: string;
  description: string | null;
  requiresDocument: boolean;
  maxConsecutiveDays: number | null;
  blackoutDates: string[];
  autoApprovalThreshold: number | null;
  isActive: boolean;
};

type LeaveRequestFormProps = {
  workingDays?: number[];
  policies?: LeavePolicySummary[];
};

export function LeaveRequestForm({
  workingDays,
  policies = [],
}: LeaveRequestFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    leaveType: 'CP',
    startDate: '',
    endDate: '',
    halfDayStart: false,
    halfDayEnd: false,
    comment: '',
    documentUrl: '',
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectiveWorkingDays =
    workingDays && workingDays.length > 0 ? workingDays : DEFAULT_WORKING_DAYS;

  const workingDaysLabel = effectiveWorkingDays
    .map((dayIndex) => WEEKDAY_LABELS[dayIndex])
    .filter(Boolean)
    .join(', ');

  const workingDaysDescription = workingDaysLabel || 'lundi à vendredi';

  const requiresDocument = policies.some((policy) => policy.requiresDocument);
  const documentPolicies = policies.filter((policy) => policy.requiresDocument);

  const { businessDays, durationLabel, helperMessage, hasError } =
    useMemo(() => {
      const { startDate, endDate, halfDayStart, halfDayEnd } = formData;

      if (!startDate || !endDate) {
        return {
          businessDays: null,
          durationLabel: null,
          helperMessage: 'Sélectionnez vos dates pour calculer la durée.',
          hasError: false,
        };
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return {
          businessDays: null,
          durationLabel: null,
          helperMessage: 'Les dates sélectionnées ne sont pas valides.',
          hasError: true,
        };
      }

      if (start > end) {
        return {
          businessDays: null,
          durationLabel: null,
          helperMessage:
            'La date de fin doit être postérieure à la date de début.',
          hasError: true,
        };
      }

      const businessDays = calculateBusinessDays(start, end, {
        workingDays: effectiveWorkingDays,
        halfDayStart,
        halfDayEnd,
      });

      if (businessDays <= 0) {
        return {
          businessDays: null,
          durationLabel: null,
          helperMessage:
            'La période sélectionnée ne contient aucun jour ouvré.',
          hasError: true,
        };
      }

      const formatter = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: businessDays % 1 === 0 ? 0 : 1,
        maximumFractionDigits: 1,
      });

      return {
        businessDays,
        durationLabel: `${formatter.format(businessDays)} jour${businessDays > 1 ? 's' : ''} ouvré${businessDays > 1 ? 's' : ''}`,
        helperMessage: `Calcul basé sur les jours ouvrés configurés (${workingDaysDescription}).`,
        hasError: false,
      };
    }, [formData, effectiveWorkingDays, workingDaysDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (hasError || !businessDays) {
      setSubmitError(
        'Veuillez corriger les dates avant de soumettre votre demande.'
      );
      return;
    }

    if (requiresDocument && !formData.documentUrl.trim()) {
      setSubmitError(
        'Un justificatif est requis pour cette politique. Merci de renseigner l’URL du document.'
      );
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      totalDays: businessDays,
    };

    try {
      const response = await fetch('/api/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
          typeof errorBody?.message === 'string'
            ? errorBody.message
            : 'Une erreur est survenue lors de la soumission.';
        setSubmitError(message);
        return;
      }

      router.push('/dashboard/leaves');
      router.refresh();
    } catch (error) {
      console.error('Leave request submission failed', error);
      setSubmitError(
        'Impossible de soumettre la demande. Réessayez plus tard.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
        {/* Leave Type */}
        <div>
          <label
            htmlFor="leaveType"
            className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
          >
            Type de congé *
          </label>
          <select
            id="leaveType"
            value={formData.leaveType}
            onChange={(e) =>
              setFormData({ ...formData, leaveType: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="CP">Congés Payés</option>
            <option value="RTT">RTT</option>
            <option value="CSS">Congés Sans Solde</option>
            <option value="SICK">Congé Maladie</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
            >
              Date de début *
            </label>
            <div className="relative">
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            <div className="mt-2">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={formData.halfDayStart}
                  onChange={(e) =>
                    setFormData({ ...formData, halfDayStart: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                Demi-journée (après-midi)
              </label>
            </div>
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
            >
              Date de fin *
            </label>
            <div className="relative">
              <input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            <div className="mt-2">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={formData.halfDayEnd}
                  onChange={(e) =>
                    setFormData({ ...formData, halfDayEnd: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                Demi-journée (matin)
              </label>
            </div>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
          >
            Commentaire (optionnel)
          </label>
          <textarea
            id="comment"
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            rows={4}
            placeholder="Ajoutez un commentaire à votre demande..."
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Document */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <label
              htmlFor="documentUrl"
              className="block text-sm font-semibold text-slate-900 dark:text-white"
            >
              Justificatif (URL){' '}
              {requiresDocument ? (
                <span className="text-red-600">*</span>
              ) : null}
            </label>
            {requiresDocument ? (
              <span className="text-xs font-medium text-red-600">
                Requis par la politique
              </span>
            ) : (
              <span className="text-xs text-slate-500">Optionnel</span>
            )}
          </div>
          <input
            id="documentUrl"
            type="url"
            value={formData.documentUrl}
            onChange={(e) =>
              setFormData({ ...formData, documentUrl: e.target.value })
            }
            placeholder="https://..."
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={requiresDocument}
          />
          {documentPolicies.length > 0 ? (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Documents requis pour :{' '}
              {documentPolicies.map((policy) => policy.name).join(', ')}.
              Fournissez un lien vers votre justificatif (Google Drive, Dropbox,
              etc.).
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Ajoutez un justificatif si nécessaire (lien vers un document ou
              dossier partagé).
            </p>
          )}
        </div>

        {/* Info Box */}
        <div
          className={`rounded-lg border p-4 ${
            hasError
              ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200'
              : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
          }`}
        >
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="space-y-1 text-sm">
              {durationLabel && (
                <p className="font-semibold">Durée estimée : {durationLabel}</p>
              )}
              <p>{helperMessage}</p>
              <p>
                Une fois soumise, votre demande sera envoyée à votre manager
                pour validation. Vous recevrez une notification par email après
                traitement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={hasError || isSubmitting}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isSubmitting ? 'Envoi en cours…' : 'Soumettre la demande'}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition font-medium"
        >
          Annuler
        </button>
      </div>
      {submitError && (
        <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
      )}
    </form>
  );
}
