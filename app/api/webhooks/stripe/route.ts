import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { Plan } from '@prisma/client';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 });
  }

  const body = await request.text();

  let event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata ?? {};
      const companyId = metadata.companyId;
      const maybePlan = metadata.plan as string | undefined;
      const allowedPlans = new Set<Plan>(Object.values(Plan));
      const plan =
        maybePlan && allowedPlans.has(maybePlan as Plan)
          ? (maybePlan as Plan)
          : undefined;
      const subscriptionId =
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id;

      if (!companyId || !plan || !subscriptionId) {
        console.warn('Checkout session metadata incomplete:', metadata);
        break;
      }

      await db.company.update({
        where: { id: companyId },
        data: {
          plan,
          stripeSubscriptionId: subscriptionId,
          trialEndsAt: null,
        },
      });

      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      await db.company.update({
        where: { stripeSubscriptionId: subscription.id },
        data: { plan: Plan.TRIAL, stripeSubscriptionId: null },
      });

      break;
    }

    // Autres événements...
  }

  return NextResponse.json({ received: true });
}
