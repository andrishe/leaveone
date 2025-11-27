import webpush from 'web-push';
import { db } from '@/lib/db';

webpush.setVapidDetails(
  'mailto:contact@leaveone.com',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPushNotification(data: {
  userId: string;
  title: string;
  body: string;
  url: string;
}) {
  // Récupérer subscription utilisateur
  const subscription = await db.pushSubscription.findFirst({
    where: { userId: data.userId },
  });

  if (!subscription) return;

  await webpush.sendNotification(
    JSON.parse(subscription.subscription),
    JSON.stringify({
      title: data.title,
      body: data.body,
      url: data.url,
    })
  );
}
