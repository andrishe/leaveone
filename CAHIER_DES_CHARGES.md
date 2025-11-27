# 📋 Cahier des Charges - LeaveOne SaaS

> **Version:** 1.0  
> **Date:** Janvier 2025  
> **Statut:** En développement  
> **Stack:** Next.js 15 Full-Stack (sans Supabase)

---

## 📑 Table des Matières

1. [Vision du Projet](#1-vision-du-projet)
2. [Objectifs & Positionnement](#2-objectifs--positionnement)
3. [Modèle Économique](#3-modèle-économique)
4. [Architecture Technique](#4-architecture-technique)
5. [Modèle de Données](#5-modèle-de-données)
6. [Règles Métier](#6-règles-métier)
7. [Sécurité Multi-Tenant](#7-sécurité-multi-tenant)
8. [Structure du Projet](#8-structure-du-projet)
9. [API Routes](#9-api-routes)
10. [Notifications](#10-notifications)
11. [Paiements](#11-paiements)
12. [Roadmap](#12-roadmap)
13. [Configuration](#13-configuration)
14. [Checklist Sécurité](#14-checklist-sécurité)

---

## 1. Vision du Projet

### 🎯 Proposition de Valeur

**"La gestion des congés sans prise de tête"**

Application SaaS permettant aux TPE/PME de gérer facilement les congés de leurs employés, sans passer par Excel ou des outils complexes.

### 🎨 Caractéristiques Principales

- ✅ **Simplicité extrême** - Configuration en 5 minutes
- ✅ **Multi-entreprise** - Isolation totale des données
- ✅ **Full-stack Next.js** - Pas de dépendances externes (Supabase)
- ✅ **Mobile-first** - Optimisé pour connexions lentes
- ✅ **Prix forfaitaire** - Par entreprise, pas par utilisateur

### 🎯 Cible Client

| Segment      | Taille          | Exemples                                |
| ------------ | --------------- | --------------------------------------- |
| **TPE**      | 5-50 employés   | Garages, commerces, BTP, restaurants    |
| **PME**      | 50-200 employés | Logistique, transport, centres de santé |
| **Startups** | 10-100 employés | Agences web, cabinets d'expertise       |

### 💡 Différenciation

| Critère      | LeaveOne           | Concurrents (Lucca, Factorial) |
| ------------ | ------------------ | ------------------------------ |
| Simplicité   | ⭐⭐⭐⭐⭐         | ⭐⭐ (trop complexe)           |
| Tarification | Forfait/entreprise | Par utilisateur                |
| Onboarding   | 5 minutes          | 1-2 heures                     |
| Stack        | Next.js full-stack | Multi-services                 |
| Prix entrée  | 19€/mois           | 50€+/mois                      |

---

## 2. Objectifs & Positionnement

### 🎯 Objectifs Business (6 mois)

- [ ] **100 clients payants** (MRR: 4 900€)
- [ ] **Taux conversion trial → payant**: >25%
- [ ] **Churn mensuel**: <5%
- [ ] **NPS (Net Promoter Score)**: >50

### 🎯 Objectifs Produit

- [ ] **Temps validation demande**: <1 minute
- [ ] **Uptime**: >99.9%
- [ ] **Temps réponse API**: <200ms
- [ ] **Core Web Vitals**: Tous "Good"

### 📊 Problème Résolu

| Pain Point                 | Solution LeaveOne         |
| -------------------------- | ------------------------- |
| Excel/WhatsApp chaotique   | Interface web centralisée |
| Calculs manuels erreurs    | Automatisation totale     |
| Pas d'historique           | Audit trail complet       |
| Validations perdues        | Notifications temps réel  |
| Politique non standardisée | Templates configurables   |

---

## 3. Modèle Économique

### 💰 Tarification

| Plan           | Prix/mois | Limite employés | Trial    | Fonctionnalités                                              |
| -------------- | --------- | --------------- | -------- | ------------------------------------------------------------ |
| **Trial**      | 0€        | Illimité        | 14 jours | Toutes fonctionnalités, sans CB                              |
| **Starter**    | 19€       | ≤ 20            | -        | Congés basiques, validation, calendrier, email               |
| **Business**   | 49€       | ≤ 100           | -        | + Politiques custom, push notifs, export CSV, multi-managers |
| **Enterprise** | 99€       | Illimité        | -        | + Multi-sites, analytics, intégrations, support phone        |

### 📈 Projection Revenus (6 mois)
