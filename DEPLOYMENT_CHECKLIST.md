# 🚀 Checklist de Déploiement Production - LeaveOne

## ✅ Améliorations Complétées

Toutes les fonctionnalités critiques ont été implémentées ! Le projet compile sans erreurs.

---

## 🔴 ACTIONS CRITIQUES AVANT DÉPLOIEMENT

### 1. Régénérer TOUS les Secrets

⚠️ **CRITIQUE** : Les credentials actuels ont été exposés dans Git et doivent être changés.

#### a) Base de données (Neon)
```bash
# 1. Aller sur https://console.neon.tech
# 2. Naviguer vers votre projet
# 3. Settings → Reset Password
# 4. Copier la nouvelle DATABASE_URL
# 5. Mettre à jour .env
```

#### b) BETTER_AUTH_SECRET
```bash
# Générer un nouveau secret
openssl rand -base64 32

# Mettre à jour dans .env
BETTER_AUTH_SECRET="votre_nouveau_secret_ici"
```

#### c) Resend API Key (pour emails)
```bash
# 1. Aller sur https://resend.com/api-keys
# 2. Créer une nouvelle API key
# 3. Mettre à jour dans .env
RESEND_API_KEY="re_votre_vraie_clé"
```

#### d) Stripe (si vous utilisez billing)
```bash
# 1. Aller sur https://dashboard.stripe.com/apikeys
# 2. Utiliser les clés de production (pk_live_... et sk_live_...)
# 3. Mettre à jour dans .env
STRIPE_SECRET_KEY="sk_live_votre_clé"
STRIPE_WEBHOOK_SECRET="whsec_votre_secret"
```

### 2. Nettoyer l'Historique Git

Les anciens secrets sont dans l'historique Git. Options :

**Option A: Nouveau repository (recommandé)**
```bash
# Supprimer l'historique Git
rm -rf .git

# Initialiser un nouveau repo
git init
git add .
git commit -m "Initial commit - Production ready"

# Pusher vers un nouveau repo
git remote add origin <votre-nouveau-repo>
git push -u origin main
```

**Option B: Utiliser git-filter-repo (avancé)**
```bash
# Installer git-filter-repo
brew install git-filter-repo  # macOS

# Supprimer .env de l'historique
git filter-repo --path .env --invert-paths

# Force push (⚠️ destructif)
git push origin --force --all
```

### 3. Vérifier .gitignore

```bash
# S'assurer que .env est ignoré
cat .gitignore | grep ".env"

# Devrait afficher:
# .env*
# .env.local*
```

---

## 🟡 Configuration Production

### 1. Variables d'Environnement Vercel

Dans Vercel Dashboard → Settings → Environment Variables :

```bash
# Base de données
DATABASE_URL="postgresql://..." # Nouvelle valeur de Neon

# Auth
BETTER_AUTH_SECRET="..." # Nouveau secret généré
BETTER_AUTH_URL="https://votre-domaine.com"

# URLs
NEXT_PUBLIC_URL="https://votre-domaine.com"
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"

# Email (Resend)
RESEND_API_KEY="re_..." # Votre vraie clé
SUPPORT_INBOX="support@votre-domaine.com"

# Support
NEXT_PUBLIC_SUPPORT_EMAIL="support@votre-domaine.com"
NEXT_PUBLIC_HELP_CENTER_URL="https://help.votre-domaine.com"

# Stripe (optionnel)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_STARTER_MONTHLY="price_..."
STRIPE_PRICE_STARTER_YEARLY="price_..."
STRIPE_PRICE_BUSINESS_MONTHLY="price_..."
STRIPE_PRICE_BUSINESS_YEARLY="price_..."
STRIPE_PRICE_ENTERPRISE_MONTHLY="price_..."
STRIPE_PRICE_ENTERPRISE_YEARLY="price_..."
```

### 2. Migrations Base de Données

```bash
# En production, utiliser
npx prisma migrate deploy

# PAS migrate dev (qui peut casser la production)
```

### 3. Seed Initial (première fois)

```bash
# Créer les données de base (types de congés, admin initial)
npx prisma db seed
```

---

## 🧪 Tests Pré-Production

### 1. Tests Locaux

```bash
# Build de production
pnpm build

# Démarrer en mode production
pnpm start

# Tester sur http://localhost:3000
```

### 2. Tests à Effectuer

- [ ] Login avec admin
- [ ] Créer une demande de congé
- [ ] Vérifier que le solde passe en "pending"
- [ ] Approuver la demande
- [ ] Vérifier que le solde est déduit
- [ ] Vérifier l'email de confirmation (si Resend configuré)
- [ ] Rejeter une demande
- [ ] Vérifier que le pending est retiré
- [ ] Vérifier l'email de rejet
- [ ] Créer un employé
- [ ] Import CSV d'employés
- [ ] Export CSV des congés
- [ ] Tester en tant que Manager (approbation limitée à son équipe)
- [ ] Tester en tant qu'Employé (pas d'accès admin)

### 3. Tests de Sécurité

- [ ] Rate limiting fonctionne (trop de requêtes = erreur 429)
- [ ] Impossible d'approuver hors de son périmètre (Manager)
- [ ] Impossible d'accéder aux données d'une autre entreprise
- [ ] Validation des inputs (essayer des données invalides)
- [ ] HTTPS activé (pas de HTTP)

---

## 📊 Monitoring & Logging

### Recommandé d'ajouter :

**Sentry (Error Tracking)**
```bash
pnpm add @sentry/nextjs

# Suivre: https://docs.sentry.io/platforms/javascript/guides/nextjs/
```

**LogRocket (Session Replay)**
```bash
pnpm add logrocket

# Suivre: https://docs.logrocket.com/docs/nextjs
```

**Vercel Analytics**
- Activé par défaut sur Vercel
- Aller dans Dashboard → Analytics

---

## 🗓️ Maintenance Planifiée

### Quotidienne
- Vérifier les logs d'erreurs (Vercel Dashboard)
- Vérifier les emails non envoyés

### Hebdomadaire
- Vérifier les backups de la base de données (Neon)
- Vérifier les métriques d'utilisation

### Mensuelle
- Mettre à jour les dépendances : `pnpm update`
- Vérifier les nouvelles vulnérabilités : `pnpm audit`
- Tester les fonctionnalités critiques

### Annuelle (Début janvier)
```bash
# Réinitialiser les soldes pour la nouvelle année
npx tsx scripts/annual-balance-reset.ts 2026
```

---

## 🆘 En Cas de Problème

### Logs Vercel
```bash
# Voir les logs en temps réel
vercel logs <deployment-url>

# Filtrer les erreurs
vercel logs --level error
```

### Problèmes Communs

**1. "Database connection error"**
- Vérifier que DATABASE_URL est correct
- Vérifier que Neon accepte les connexions
- Vérifier les migrations : `npx prisma migrate status`

**2. "Email not sent"**
- Vérifier RESEND_API_KEY
- Vérifier les quotas Resend
- Logs dans Resend dashboard

**3. "Session expired immediately"**
- Vérifier BETTER_AUTH_SECRET
- Vérifier BETTER_AUTH_URL (doit matcher le domaine)
- Vérifier que les cookies HTTPS sont autorisés

**4. "Balance not deducted"**
- Vérifier les logs de transaction
- Vérifier que le solde existait pour l'année
- Lancer : `npx tsx scripts/annual-balance-reset.ts <année>`

---

## ✅ Checklist Finale

Avant de mettre en production :

- [ ] Tous les secrets ont été régénérés
- [ ] .env n'est PAS dans Git
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Migrations appliquées en production
- [ ] Seed exécuté (première fois)
- [ ] Build de production réussi
- [ ] Tests manuels effectués
- [ ] Monitoring configuré (Sentry recommandé)
- [ ] Backups automatiques configurés (Neon)
- [ ] Documentation lue par l'équipe
- [ ] Plan de rollback préparé

---

## 🎉 Post-Déploiement

### Jour 1
- Surveiller les logs toutes les heures
- Tester toutes les fonctionnalités en production
- Vérifier que les emails partent

### Semaine 1
- Surveiller les logs quotidiennement
- Collecter les retours utilisateurs
- Corriger les bugs mineurs rapidement

### Mois 1
- Analyser les métriques d'utilisation
- Optimiser les fonctionnalités les plus utilisées
- Planifier les prochaines fonctionnalités

---

## 📞 Support

En cas de problème bloquant :
1. Vérifier les logs Vercel
2. Vérifier SECURITY.md
3. Vérifier API.md
4. Créer une issue sur GitHub (si applicable)

---

**Bonne chance pour le déploiement ! 🚀**
