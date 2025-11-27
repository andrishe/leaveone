import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
});

export const STRIPE_PRICES = {
  STARTER: {
    MONTHLY: process.env.STRIPE_PRICE_STARTER_MONTHLY!,
    YEARLY: process.env.STRIPE_PRICE_STARTER_YEARLY!,
  },
  BUSINESS: {
    MONTHLY: process.env.STRIPE_PRICE_BUSINESS_MONTHLY!,
    YEARLY: process.env.STRIPE_PRICE_BUSINESS_YEARLY!,
  },
  ENTERPRISE: {
    MONTHLY: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY!,
    YEARLY: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY!,
  },
} as const;

export type StripePlanKey = keyof typeof STRIPE_PRICES;
export type BillingInterval = 'MONTHLY' | 'YEARLY';
