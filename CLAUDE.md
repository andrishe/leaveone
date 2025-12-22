📌 Contexte du projet
Application de gestion des congés pour PME
🎯 Objectif du projet

Développer une application web de gestion des congés destinée à une PME d’environ 150 employés, afin de centraliser, automatiser et fiabiliser la gestion des absences (congés payés, RTT, congés sans solde, etc.).

L’application doit remplacer les échanges informels (emails, Excel, papier) par une solution numérique simple, sécurisée et accessible.

👥 Utilisateurs cibles
Employés

Consulter leur solde de congés

Faire une demande de congé

Suivre le statut de leurs demandes (en attente, validée, refusée)

Consulter l’historique de leurs absences

Managers

Visualiser les demandes de leur équipe

Valider ou refuser les congés

Avoir une vue calendrier des absences

Éviter les chevauchements critiques

Administrateurs / RH

Gérer les utilisateurs et les rôles

Configurer les types de congés

Ajuster les soldes manuellement si besoin

Accéder aux statistiques et exports (CSV)

🧩 Fonctionnalités principales
Gestion des congés

Création de demandes avec date de début / fin

Calcul automatique du nombre de jours

Gestion des statuts (pending / approved / rejected)

Historique complet par utilisateur

Gestion des soldes

Solde annuel par type de congé

Déduction automatique après validation

Réinitialisation annuelle configurable

Ajustement manuel par l’admin

Workflow de validation

Validation par manager

Notifications (email ou interface)

Commentaires lors d’un refus

Sécurité et droits

Authentification sécurisée

Accès basé sur les rôles (employé / manager / admin)

Isolation stricte des données par utilisateur

🏗️ Architecture technique
Stack retenue

Frontend & Backend : Next.js (App Router)

Langage : TypeScript (full-stack)

ORM : Prisma

Base de données : PostgreSQL

Hébergement DB : Neon 

Auth : BetterAuth 

Déploiement : Vercel

Architecture globale
Utilisateur (navigateur)
        ↓
Next.js (UI + API Routes)
        ↓
Prisma ORM
        ↓
PostgreSQL (Neon / Supabase)


➡️ Architecture monolithique full-stack, adaptée à un développeur solo, facile à maintenir et à faire évoluer.

⚙️ Contraintes et exigences
Techniques

Code maintenable et typé

Performance suffisante pour ~150 utilisateurs

Déploiement simple et automatisé

Pas de dépendance inutile à des microservices

Métier

Règles simples et explicites

Interface claire, non technique

Données fiables et historisées

Possibilité d’évolution future (reporting, intégration SIRH)

📈 Scalabilité et évolution

L’application est conçue pour :

fonctionner sans problème jusqu’à plusieurs centaines d’utilisateurs

évoluer vers :

statistiques avancées

export comptable / RH

intégration calendrier (Google / Outlook)

API externe si nécessaire

La stack permet une extraction future du backend si le besoin se présente, sans réécriture complète.

💰 Coût estimé d’exploitation

Base de données PostgreSQL : ~20–30 €/mois

Hébergement Next.js : gratuit ou faible coût (Vercel)

Coût total mensuel estimé : < 50 €/mois