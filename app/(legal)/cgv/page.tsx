import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente - LeaveOne',
  description: 'Conditions générales de vente de LeaveOne',
};

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Conditions Générales de Vente
        </h1>

        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-8 space-y-8 text-slate-700 dark:text-slate-300">
          <section>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
            <p className="mb-4">
              Les présentes Conditions Générales de Vente (CGV) régissent les relations
              commerciales entre SIMA Creation Web, éditeur de LeaveOne, et ses Clients.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              1. Définitions
            </h2>
            <ul className="space-y-2">
              <li><strong>Éditeur :</strong> SIMA Creation Web, société éditrice de LeaveOne</li>
              <li><strong>Client :</strong> Personne morale ou physique souscrivant à un abonnement LeaveOne</li>
              <li><strong>Service :</strong> La solution SaaS LeaveOne de gestion des congés</li>
              <li><strong>Abonnement :</strong> Contrat de fourniture du Service sur une période définie</li>
              <li><strong>Utilisateur :</strong> Personne physique autorisée par le Client à accéder au Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              2. Objet
            </h2>
            <p>
              Les présentes CGV définissent les conditions de souscription, d'utilisation et de
              facturation des abonnements LeaveOne. Elles complètent les Conditions Générales
              d'Utilisation (CGU) accessibles à l'adresse{' '}
              <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                /terms
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              3. Offres et Tarifs
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  3.1 Formules d'abonnement
                </h3>
                <p className="mb-4">LeaveOne propose les formules suivantes :</p>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="font-medium">Starter</span>
                    <span>25 €/mois ou 19 €/mois (annuel)</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="font-medium">Growth</span>
                    <span>59 €/mois ou 49 €/mois (annuel)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Enterprise</span>
                    <span>119 €/mois ou 99 €/mois (annuel)</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  Les tarifs sont indiqués hors taxes (HT). La TVA applicable sera ajoutée selon
                  la législation en vigueur.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  3.2 Modification des tarifs
                </h3>
                <p>
                  L'Éditeur se réserve le droit de modifier ses tarifs à tout moment. Toute
                  modification sera notifiée au Client au moins 30 jours avant son entrée en
                  vigueur. Les nouveaux tarifs s'appliqueront à compter du prochain renouvellement
                  de l'abonnement.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              4. Souscription et Activation
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  4.1 Processus de souscription
                </h3>
                <p>
                  La souscription s'effectue en ligne sur le site LeaveOne. Le Client choisit sa
                  formule, crée son compte et procède au paiement. La souscription est ferme et
                  définitive dès validation du paiement.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  4.2 Période d'essai
                </h3>
                <p>
                  Une période d'essai gratuite de 14 jours peut être proposée. Pendant cette
                  période, le Client peut résilier sans frais. À l'issue de la période d'essai,
                  l'abonnement est automatiquement converti en abonnement payant, sauf résiliation
                  préalable.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  4.3 Activation du Service
                </h3>
                <p>
                  L'accès au Service est activé immédiatement après confirmation du paiement ou
                  début de la période d'essai. Le Client reçoit un email de confirmation avec ses
                  identifiants d'accès.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              5. Modalités de Paiement
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  5.1 Moyens de paiement acceptés
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Carte bancaire (Visa, MasterCard, American Express)</li>
                  <li>Prélèvement SEPA (pour les abonnements annuels)</li>
                  <li>Virement bancaire (sur devis, pour les grands comptes)</li>
                </ul>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Les paiements sont sécurisés par Stripe, certifié PCI-DSS niveau 1.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  5.2 Facturation
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Abonnement mensuel :</strong> Facturation le 1er de chaque mois</li>
                  <li><strong>Abonnement annuel :</strong> Facturation en une seule fois à la souscription</li>
                </ul>
                <p className="mt-2">
                  Les factures sont envoyées par email et accessibles dans l'espace client.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  5.3 Retard de paiement
                </h3>
                <p className="mb-2">
                  En cas de défaut de paiement à l'échéance :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Un rappel est envoyé par email</li>
                  <li>Après 7 jours, une notification de suspension est envoyée</li>
                  <li>Après 14 jours, l'accès au Service est suspendu</li>
                  <li>Après 30 jours, le compte peut être résilié</li>
                </ul>
                <p className="mt-2">
                  Des pénalités de retard égales à 3 fois le taux d'intérêt légal pourront être
                  appliquées, ainsi qu'une indemnité forfaitaire de 40 € pour frais de recouvrement.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              6. Durée et Renouvellement
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  6.1 Durée de l'abonnement
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Mensuel :</strong> Engagement de 1 mois, renouvelable tacitement</li>
                  <li><strong>Annuel :</strong> Engagement de 12 mois, renouvelable tacitement</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  6.2 Renouvellement automatique
                </h3>
                <p>
                  L'abonnement est renouvelé automatiquement à chaque échéance pour une durée
                  identique, sauf résiliation préalable par le Client. Le Client est informé du
                  renouvellement par email au moins 15 jours avant l'échéance.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              7. Résiliation
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  7.1 Résiliation par le Client
                </h3>
                <p className="mb-2">Le Client peut résilier son abonnement :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Depuis son espace client, rubrique "Paramètres &gt; Abonnement"</li>
                  <li>Par email à : billing@simacreationweb.com</li>
                </ul>
                <p className="mt-2">
                  La résiliation prend effet à la fin de la période d'abonnement en cours.
                  Aucun remboursement prorata temporis n'est effectué pour la période restante.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  7.2 Résiliation par l'Éditeur
                </h3>
                <p className="mb-2">
                  L'Éditeur se réserve le droit de résilier l'abonnement en cas de :
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Non-paiement persistant après mise en demeure</li>
                  <li>Violation des CGU ou des présentes CGV</li>
                  <li>Utilisation frauduleuse ou abusive du Service</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  7.3 Conséquences de la résiliation
                </h3>
                <p className="mb-2">À la résiliation :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>L'accès au Service est désactivé</li>
                  <li>Le Client peut exporter ses données pendant 30 jours</li>
                  <li>Les données sont supprimées après 90 jours (sauf obligation légale de conservation)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              8. Droit de Rétractation
            </h2>
            <p className="mb-4">
              Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation
              ne s'applique pas aux contrats de fourniture de contenu numérique non fourni sur un
              support matériel dont l'exécution a commencé avec l'accord du consommateur.
            </p>
            <p>
              En souscrivant à LeaveOne, le Client reconnaît et accepte que l'accès immédiat au
              Service constitue le début d'exécution du contrat et renonce expressément à son
              droit de rétractation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              9. Niveau de Service (SLA)
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  9.1 Disponibilité
                </h3>
                <p>
                  L'Éditeur s'engage à maintenir une disponibilité du Service de 99,5% par mois,
                  hors maintenance programmée et cas de force majeure.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  9.2 Support
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Starter :</strong> Support par email (réponse sous 48h ouvrées)</li>
                  <li><strong>Growth :</strong> Support prioritaire (réponse sous 24h ouvrées)</li>
                  <li><strong>Enterprise :</strong> Support dédié avec interlocuteur privilégié</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  9.3 Compensation
                </h3>
                <p>
                  En cas de non-respect de l'engagement de disponibilité, le Client peut demander
                  un avoir correspondant au prorata de la période d'indisponibilité.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              10. Limitation de Responsabilité
            </h2>
            <div className="space-y-4">
              <p>
                La responsabilité de l'Éditeur est limitée au montant des sommes effectivement
                versées par le Client au titre de l'abonnement en cours.
              </p>
              <p>
                L'Éditeur ne saurait être tenu responsable des dommages indirects, tels que :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Perte de chiffre d'affaires ou de bénéfices</li>
                <li>Perte de données</li>
                <li>Préjudice d'image</li>
                <li>Perte de chance</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              11. Propriété Intellectuelle
            </h2>
            <p className="mb-4">
              L'Éditeur reste propriétaire de l'ensemble des droits de propriété intellectuelle
              sur le Service. L'abonnement confère au Client un droit d'usage non exclusif,
              non cessible et non transférable pour la durée de l'abonnement.
            </p>
            <p>
              Le Client conserve la propriété de ses données et accorde à l'Éditeur une licence
              limitée pour traiter ces données dans le cadre de la fourniture du Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              12. Données Personnelles
            </h2>
            <p>
              Le traitement des données personnelles est régi par notre{' '}
              <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Politique de Confidentialité
              </a>. L'Éditeur agit en qualité de sous-traitant des données au sens du RGPD
              pour le compte du Client, responsable de traitement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              13. Modification des CGV
            </h2>
            <p>
              L'Éditeur se réserve le droit de modifier les présentes CGV. Toute modification
              sera notifiée au Client par email au moins 30 jours avant son entrée en vigueur.
              Si le Client n'accepte pas les modifications, il peut résilier son abonnement
              avant l'entrée en vigueur des nouvelles CGV.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              14. Droit Applicable et Litiges
            </h2>
            <div className="space-y-4">
              <p>
                Les présentes CGV sont soumises au droit français.
              </p>
              <p>
                En cas de litige, les parties s'engagent à rechercher une solution amiable.
                À défaut d'accord, le litige sera soumis aux tribunaux compétents de Paris.
              </p>
              <p>
                Conformément à l'article L.612-1 du Code de la consommation, le Client consommateur
                peut recourir gratuitement au service de médiation MEDICYS accessible à :{' '}
                <a
                  href="https://www.medicys.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  www.medicys.fr
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              15. Contact
            </h2>
            <p className="mb-4">Pour toute question concernant ces CGV ou votre abonnement :</p>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg space-y-2">
              <p><strong>SIMA Creation Web</strong></p>
              <p><strong>Email facturation :</strong> billing@simacreationweb.com</p>
              <p><strong>Email commercial :</strong> sales@simacreationweb.com</p>
              <p><strong>Support :</strong> support@leaveone.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
