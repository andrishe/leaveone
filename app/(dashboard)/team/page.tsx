import { TeamStats } from '@/components/team/team-stats';
import { TeamCalendar } from '@/components/team/team-calendar';
import { TeamRequests } from '@/components/team/team-requests';
import { requireRole } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

export default async function TeamPage() {
  const session = await requireRole(['MANAGER', 'ADMIN']);
  const userRecord = await db.user.findUnique({
    where: { id: session.user.id },
    select: { companyId: true, name: true, role: true },
  });

  if (!userRecord) {
    throw new Error('Utilisateur introuvable pour la vue équipe.');
  }

  const isAdmin = userRecord.role === 'ADMIN';
  const managerId = isAdmin ? undefined : session.user.id;
  const managerName =
    userRecord.name ?? (isAdmin ? 'votre entreprise' : 'votre équipe');
  const companyId = userRecord.companyId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Mon équipe
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {isAdmin
            ? 'Vue consolidée de toutes les équipes de votre entreprise.'
            : `Gérez les demandes de congés de votre équipe, ${managerName}`}
        </p>
      </div>

      {/* Stats */}
      <TeamStats companyId={companyId} managerId={managerId} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Requests (2/3 width) */}
        <div className="lg:col-span-2">
          <TeamRequests
            companyId={companyId}
            managerId={managerId}
            isAdmin={isAdmin}
          />
        </div>

        {/* Team Calendar (1/3 width) */}
        <div>
          <TeamCalendar companyId={companyId} managerId={managerId} />
        </div>
      </div>
    </div>
  );
}
