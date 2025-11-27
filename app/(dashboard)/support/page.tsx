import Link from 'next/link';
import { LifeBuoy, Mail, MessageCircle, FileText } from 'lucide-react';
import { FeedbackForm } from '@/components/support/feedback-form';
import { requireAuth } from '@/lib/auth-helpers';

const supportEmail =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@leaveone.com';
const helpCenterUrl =
  process.env.NEXT_PUBLIC_HELP_CENTER_URL ?? 'https://help.leaveone.com';

export const metadata = {
  title: 'Support & aide',
  description:
    'Retrouvez toutes les ressources pour contacter le support LeaveOne, consulter la FAQ et partager votre feedback.',
};

export default async function SupportPage() {
  await requireAuth();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="rounded-lg bg-blue-600/10 p-3 text-blue-600 dark:text-blue-400">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Support & aide
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Besoin d'un coup de main ? Consultez nos ressources ou
              envoyez-nous un message : nous vous répondons sous un jour ouvré.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`mailto:${supportEmail}`}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-300"
              >
                <Mail className="h-4 w-4" />
                Contacter le support
              </Link>
              <Link
                href={helpCenterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/60"
              >
                <FileText className="h-4 w-4" />
                Consulter la FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FeedbackForm supportEmail={supportEmail} />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Autres ressources utiles
        </h2>
        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-3">
            <MessageCircle className="mt-1 h-4 w-4 text-blue-500 dark:text-blue-300" />
            <span>
              Rejoignez le canal #leaveone sur Slack pour échanger avec les
              autres managers et partager vos bonnes pratiques.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <FileText className="mt-1 h-4 w-4 text-blue-500 dark:text-blue-300" />
            <span>
              Consultez la documentation RH interne pour les procédures
              détaillées (liée dans la FAQ).
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
