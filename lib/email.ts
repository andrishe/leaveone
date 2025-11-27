import { Resend } from 'resend';
import LeaveRequestEmail from '@/emails/leave-request';
import LeaveApprovedEmail from '@/emails/leave-approved';

const resend = new Resend(process.env.RESEND_API_KEY);
const supportInbox = process.env.SUPPORT_INBOX ?? 'support@leaveone.com';

export async function sendLeaveRequestEmail(data: {
  to: string;
  employeeName: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  approvalUrl: string;
}) {
  await resend.emails.send({
    from: 'LeaveOne <notifications@leaveone.com>',
    to: data.to,
    subject: `Nouvelle demande de congé - ${data.employeeName}`,
    react: LeaveRequestEmail(data),
  });
}

export async function sendLeaveApprovedEmail(data: {
  to: string;
  startDate: Date;
  endDate: Date;
  approverName: string;
}) {
  await resend.emails.send({
    from: 'LeaveOne <notifications@leaveone.com>',
    to: data.to,
    subject: 'Congés approuvés ✅',
    react: LeaveApprovedEmail(data),
  });
}

export async function sendSupportRequestEmail(data: {
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;
  companyId: string;
  companyName: string;
  category: string;
  subject: string;
  message: string;
  includeDiagnostics: boolean;
}) {
  const replyTo = data.requesterEmail;
  const formattedSubject = `[Support] ${data.subject}`;
  const diagnosticsNote = data.includeDiagnostics ? 'Oui' : 'Non';

  const textContent = `Demande : ${data.category}
Entreprise : ${data.companyName} (${data.companyId})
Utilisateur : ${data.requesterName} (${data.requesterRole})
Email : ${data.requesterEmail}
Diagnostics partagés : ${diagnosticsNote}

Message :
${data.message}`;

  await resend.emails.send({
    from: 'LeaveOne Support <support@leaveone.com>',
    to: supportInbox,
    replyTo: replyTo,
    subject: formattedSubject,
    text: textContent,
  });
}
