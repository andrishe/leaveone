import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité - LeaveOne',
  description: 'Politique de confidentialité et protection des données de LeaveOne',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Politique de Confidentialité
        </h1>

        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-8 space-y-8 text-slate-700 dark:text-slate-300">
          <section>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
            <p className="mb-4">
              SIMA Creation Web, éditeur de LeaveOne, accorde une grande importance à la protection
              de vos données personnelles. Cette politique de confidentialité vous informe sur la
              manière dont nous collectons, utilisons et protégeons vos données.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              1. Identité du Responsable de Traitement
            </h2>
            <div className="space-y-2">
              <p><strong>Raison sociale :</strong> SIMA Creation Web</p>
              <p><strong>Produit :</strong> LeaveOne - Gestion des Congés</p>
              <p><strong>Contact DPO/RGPD :</strong> privacy@simacreationweb.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              2. Données Collectées
            </h2>
            <p className="mb-4">Nous collectons les données suivantes :</p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  2.1 Données d'identification
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Nom et prénom</li>
                  <li>Adresse email professionnelle</li>
                  <li>Identifiant unique</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  2.2 Données relatives aux congés
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Demandes de congés (dates, type, motif)</li>
                  <li>Soldes de congés</li>
                  <li>Historique des demandes</li>
                  <li>Documents justificatifs (si fournis)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  2.3 Données de connexion
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Logs de connexion</li>
                  <li>Adresse IP</li>
                  <li>Données de session</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              3. Finalités du Traitement
            </h2>
            <p className="mb-4">Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Gérer les demandes de congés</li>
              <li>Calculer et suivre les soldes de congés</li>
              <li>Assurer le workflow de validation</li>
              <li>Envoyer des notifications par email</li>
              <li>Générer des statistiques et rapports</li>
              <li>Assurer la sécurité et prévenir la fraude</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              4. Base Légale du Traitement
            </h2>
            <p className="mb-4">Le traitement de vos données repose sur :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Exécution du contrat :</strong> Fourniture du service de gestion des congés</li>
              <li><strong>Obligation légale :</strong> Respect du droit du travail</li>
              <li><strong>Intérêt légitime :</strong> Sécurité et prévention de la fraude</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              5. Destinataires des Données
            </h2>
            <p className="mb-4">Vos données sont accessibles par :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Les administrateurs de votre entreprise</li>
              <li>Votre manager (pour les demandes de congés)</li>
              <li>L'équipe support de SIMA Creation Web (uniquement en cas de support technique)</li>
              <li>Nos sous-traitants techniques (hébergement, email) :</li>
              <ul className="list-circle list-inside ml-8 mt-2 space-y-1">
                <li>Vercel (hébergement)</li>
                <li>Neon (base de données)</li>
                <li>Resend (envoi d'emails)</li>
              </ul>
            </ul>
            <p className="mt-4">
              <strong>Important :</strong> Nous ne vendons ni ne louons jamais vos données à des tiers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              6. Transferts de Données hors UE
            </h2>
            <p className="mb-4">
              Nos prestataires techniques peuvent être situés hors de l'Union Européenne. Dans ce cas,
              nous nous assurons que des garanties appropriées sont en place (clauses contractuelles
              types de la Commission Européenne, certification Privacy Shield, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              7. Durée de Conservation
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Données de compte :</strong> Pendant la durée du contrat + 3 ans</li>
              <li><strong>Historique des congés :</strong> 5 ans (conformément au Code du travail)</li>
              <li><strong>Logs de connexion :</strong> 12 mois</li>
              <li><strong>Documents justificatifs :</strong> Durée légale applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              8. Vos Droits (RGPD)
            </h2>
            <p className="mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données</li>
              <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
              <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
              <li><strong>Droit à la limitation :</strong> Limiter le traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> S'opposer au traitement de vos données</li>
              <li><strong>Droit de retirer votre consentement</strong> à tout moment</li>
            </ul>
            <p className="mt-4">
              Pour exercer vos droits, contactez-nous à : <strong>privacy@simacreationweb.com</strong>
            </p>
            <p className="mt-2">
              Vous disposez également du droit d'introduire une réclamation auprès de la CNIL
              (Commission Nationale de l'Informatique et des Libertés).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              9. Sécurité des Données
            </h2>
            <p className="mb-4">Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Chiffrement des données en transit (HTTPS/TLS)</li>
              <li>Chiffrement des mots de passe (Argon2)</li>
              <li>Accès restreint aux données (rôles et permissions)</li>
              <li>Sauvegardes régulières</li>
              <li>Surveillance et détection des incidents</li>
              <li>Limitation des tentatives de connexion (rate limiting)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              10. Cookies
            </h2>
            <p className="mb-4">
              LeaveOne utilise des cookies strictement nécessaires au fonctionnement du service
              (cookies de session). Ces cookies ne nécessitent pas de consentement préalable.
            </p>
            <p>
              Nous n'utilisons pas de cookies publicitaires ou de tracking tiers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              11. Modifications de la Politique
            </h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
              Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour.
              Les modifications substantielles vous seront notifiées par email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              12. Contact
            </h2>
            <p className="mb-4">Pour toute question concernant cette politique de confidentialité ou vos données personnelles :</p>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg space-y-2">
              <p><strong>Email :</strong> privacy@simacreationweb.com</p>
              <p><strong>Support :</strong> support@leaveone.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
