import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { LeaveRequestForm } from '@/components/leaves/leave-request-form';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { DEFAULT_WORKING_DAYS } from '@/lib/utils';

type SerializedPolicy = {
  id: string;
  name: string;
  description: string | null;
  requiresDocument: boolean;
  maxConsecutiveDays: number | null;
  blackoutDates: string[];
  autoApprovalThreshold: number | null;
  isActive: boolean;
};

export default async function NewLeavePage() {
  const session = await requireAuth();

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { companyId: true },
  });

  const companyId = user?.companyId;
  const company = companyId
    ? await db.company.findUnique({
        where: { id: companyId },

        select: { workingDays: true },
      })
    : null;

  const companyWorkingDays = (company as { workingDays?: number[] } | null)
    ?.workingDays;
  const workingDays =
    companyWorkingDays && companyWorkingDays.length > 0
      ? companyWorkingDays
      : DEFAULT_WORKING_DAYS;

  let serialisedPolicies: SerializedPolicy[] = [];

  if (companyId) {
    const policies = (await db.leavePolicy.findMany({
      where: { companyId, isActive: true },
      orderBy: { createdAt: 'desc' },
    })) as Array<
      Omit<SerializedPolicy, 'blackoutDates'> & { blackoutDates: Date[] }
    >;

    serialisedPolicies = policies.map((policy) => ({
      id: policy.id,
      name: policy.name,
      description: policy.description,
      requiresDocument: policy.requiresDocument,
      maxConsecutiveDays: policy.maxConsecutiveDays,
      blackoutDates: policy.blackoutDates.map((date) => date.toISOString()),
      autoApprovalThreshold: policy.autoApprovalThreshold,
      isActive: policy.isActive,
    }));
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href="/leaves"
        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à mes congés
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Nouvelle demande de congés
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Remplissez le formulaire pour soumettre votre demande
        </p>
      </div>

      {/* Form */}
      <LeaveRequestForm
        workingDays={workingDays}
        policies={serialisedPolicies}
      />
    </div>
  );
}
