import { createAuthClient } from 'better-auth/react';

const getBaseURL = () => {
  // En production sur Vercel, utilise NEXT_PUBLIC_APP_URL ou l'URL Vercel auto-générée
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Fallback pour Vercel (variable automatique)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  // Développement local
  return 'http://localhost:3000';
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signOut, signUp, useSession } = authClient;
