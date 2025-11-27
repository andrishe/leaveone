import { NextRequest, NextResponse } from 'next/server';
import {
  stripe,
  STRIPE_PRICES,
  StripePlanKey,
  BillingInterval,
} from '@/lib/stripe';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user, session: authSession } = authContext;

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { plan, interval = 'MONTHLY' } = (await request.json()) as {
      plan: StripePlanKey;
      interval?: BillingInterval;
    };

    if (!plan || !STRIPE_PRICES[plan]) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    }

    const priceId = STRIPE_PRICES[plan][interval];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Prix introuvable pour cet intervalle' },
        { status: 400 }
      );
    }

    const companyId = user.companyId;

    const company = await db.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Entreprise introuvable' },
        { status: 404 }
      );
    }

    // Créer/récupérer customer Stripe
    let customerId = company?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: authSession.user.email,
        metadata: { companyId },
      });
      customerId = customer.id;

      await db.company.update({
        where: { id: companyId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Créer Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_update: {
        address: 'auto',
      },
      billing_address_collection: 'required',
      allow_promotion_codes: true,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      automatic_tax: { enabled: true },
      subscription_data: {
        metadata: {
          companyId,
          plan,
          interval,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/settings?payment=cancelled`,
      metadata: {
        companyId,
        plan,
        interval,
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Impossible de générer l'URL de paiement" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Erreur création checkout: ${errorMessage}` },
      { status: 500 }
    );
  }
}
