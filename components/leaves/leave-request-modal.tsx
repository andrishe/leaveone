'use client';

import { useMemo, useState } from 'react';
import { Calendar, Info, X, Loader2, Plus } from 'lucide-react';
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

type LeaveRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workingDays?: number[];
};

export function LeaveRequestModal({
  isOpen,
  onClose,
  onSuccess,
  workingDays,
}: LeaveRequestModalProps) {
  // Liste des types de congés (à adapter si dynamique)
  const leaveTypes = [
    { id: 'CP', code: 'CP', label: 'Congés Payés' },
    { id: 'RTT', code: 'RTT', label: 'RTT' },
    { id: 'CSS', code: 'CSS', label: 'Congés Sans Solde' },
    { id: 'SICK', code: 'SICK', label: 'Congé Maladie' },
  ];

  const [formData, setFormData] = useState({
    leaveType: 'CP',
    startDate: '',
    endDate: '',
    halfDayStart: false,
    halfDayEnd: false,
    comment: '',
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
        helperMessage: `Calcul basé sur les jours ouvrés (${workingDaysDescription}).`,
        hasError: false,
      };
    }, [formData, effectiveWorkingDays, workingDaysDescription]);

  const resetForm = () => {
    setFormData({
      leaveType: 'CP',
      startDate: '',
      endDate: '',
      halfDayStart: false,
      halfDayEnd: false,
      comment: '',
    });
    setSubmitError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (hasError || !businessDays) {
      setSubmitError(
        'Veuillez corriger les dates avant de soumettre votre demande.'
      );
      return;
    }

    setIsSubmitting(true);

    // Trouver l'id du type de congé à partir du code
    const selectedType = leaveTypes.find((t) => t.code === formData.leaveType);
    const payload = {
      leaveTypeId: selectedType ? selectedType.id : formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      halfDayStart: formData.halfDayStart,
      halfDayEnd: formData.halfDayEnd,
      comment: formData.comment,
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

      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Leave request submission failed', error);
      setSubmitError(
        'Impossible de soumettre la demande. Réessayez plus tard.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-slate-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Nouvelle demande
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Créez une demande de congé
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {leaveTypes.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
              <label className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
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
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
              <label className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
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
              rows={3}
              placeholder="Ajoutez un commentaire à votre demande..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Duration Info Box */}
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
                  <p className="font-semibold">
                    Durée estimée : {durationLabel}
                  </p>
                )}
                <p>{helperMessage}</p>
              </div>
            </div>
          </div>

          {/* Error */}
          {submitError && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {submitError}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={hasError || isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {isSubmitting ? 'Envoi en cours…' : 'Soumettre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
