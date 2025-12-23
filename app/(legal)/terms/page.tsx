import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation - LeaveOne',
  description: 'Conditions générales d\'utilisation de LeaveOne',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Conditions Générales d'Utilisation
        </h1>

        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-8 space-y-8 text-slate-700 dark:text-slate-300">
          <section>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
            <p className="mb-4">
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de
              LeaveOne, une solution de gestion des congés éditée par SIMA Creation Web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              1. Définitions
            </h2>
            <ul className="space-y-2">
              <li><strong>Service :</strong> LeaveOne, plateforme de gestion des congés</li>
              <li><strong>Éditeur :</strong> SIMA Creation Web</li>
              <li><strong>Client :</strong> Entreprise souscrivant au Service</li>
              <li><strong>Utilisateur :</strong> Employé du Client accédant au Service</li>
              <li><strong>Administrateur :</strong> Personne désignée par le Client pour gérer le Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              2. Objet
            </h2>
            <p>
              Les présentes CGU ont pour objet de définir les conditions d'utilisation du Service
              LeaveOne par le Client et ses Utilisateurs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              3. Acceptation des CGU
            </h2>
            <p className="mb-4">
              L'utilisation du Service implique l'acceptation sans réserve des présentes CGU.
              Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le Service.
            </p>
            <p>
              Le Client s'engage à porter les présentes CGU à la connaissance de l'ensemble
              de ses Utilisateurs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              4. Accès au Service
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  4.1 Conditions d'accès
                </h3>
                <p>
                  Le Service est accessible en ligne 24h/24, 7j/7, sauf en cas de maintenance
                  programmée ou d'incidents techniques.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  4.2 Identifiants
                </h3>
                <p className="mb-2">
                  Chaque Utilisateur reçoit des identifiants personnels (email et mot de passe).
                </p>
                <p>
                  L'Utilisateur s'engage à :
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Garder ses identifiants confidentiels</li>
                  <li>Ne pas les partager avec des tiers</li>
                  <li>Choisir un mot de passe sécurisé</li>
                  <li>Notifier immédiatement toute utilisation non autorisée</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  4.3 Prérequis techniques
                </h3>
                <p>
                  L'accès au Service nécessite une connexion Internet et un navigateur récent.
                  Les équipements et frais de connexion sont à la charge de l'Utilisateur.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              5. Utilisation du Service
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  5.1 Utilisation conforme
                </h3>
                <p className="mb-2">L'Utilisateur s'engage à utiliser le Service :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Conformément aux lois en vigueur</li>
                  <li>De bonne foi et de manière loyale</li>
                  <li>Pour les seuls besoins de gestion des congés</li>
                  <li>Dans le respect des droits des tiers</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  5.2 Usages interdits
                </h3>
                <p className="mb-2">Il est strictement interdit de :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Tenter de contourner les mesures de sécurité</li>
                  <li>Accéder aux données d'autres entreprises</li>
                  <li>Utiliser le Service à des fins illicites</li>
                  <li>Introduire des virus ou codes malveillants</li>
                  <li>Surcharger volontairement le Service</li>
                  <li>Extraire ou copier le contenu à des fins commerciales</li>
                  <li>Rétro-ingénierie ou décompilation du Service</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              6. Données et Confidentialité
            </h2>
            <p className="mb-4">
              Les données personnelles sont traitées conformément à notre{' '}
              <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Politique de Confidentialité
              </a>.
            </p>
            <p>
              Le Client reste propriétaire de l'ensemble des données saisies dans le Service.
              SIMA Creation Web s'engage à ne pas exploiter ces données à d'autres fins que
              la fourniture du Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              7. Propriété Intellectuelle
            </h2>
            <p className="mb-4">
              Le Service, son contenu (textes, images, logos, code source, etc.) et sa structure
              sont la propriété exclusive de SIMA Creation Web et sont protégés par le droit
              d'auteur et le droit des marques.
            </p>
            <p>
              L'utilisation du Service ne confère aucun droit de propriété intellectuelle au Client
              ou aux Utilisateurs, hormis un droit d'usage dans le cadre du Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              8. Disponibilité et Maintenance
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  8.1 Disponibilité
                </h3>
                <p>
                  SIMA Creation Web met en œuvre tous les moyens raisonnables pour assurer
                  la disponibilité du Service. Toutefois, nous ne garantissons pas une
                  disponibilité à 100%.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  8.2 Maintenance
                </h3>
                <p>
                  SIMA Creation Web se réserve le droit d'effectuer des opérations de maintenance,
                  avec ou sans interruption du Service. Les maintenances planifiées seront
                  notifiées à l'avance dans la mesure du possible.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              9. Responsabilité
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  9.1 Responsabilité de l'Éditeur
                </h3>
                <p className="mb-2">
                  SIMA Creation Web s'engage à fournir le Service avec diligence et selon
                  les règles de l'art.
                </p>
                <p>
                  Notre responsabilité ne saurait être engagée en cas de :
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Force majeure ou événements indépendants de notre volonté</li>
                  <li>Utilisation non conforme du Service</li>
                  <li>Défaillance des équipements ou de la connexion du Client</li>
                  <li>Actes de tiers (piratage, etc.)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  9.2 Responsabilité du Client et des Utilisateurs
                </h3>
                <p>
                  Le Client est responsable de l'utilisation du Service par ses Utilisateurs
                  et des données qu'il y saisit.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              10. Suspension et Résiliation
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  10.1 Suspension
                </h3>
                <p>
                  SIMA Creation Web se réserve le droit de suspendre l'accès au Service en cas de :
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Violation des présentes CGU</li>
                  <li>Activité suspecte ou frauduleuse</li>
                  <li>Non-paiement (pour les services payants)</li>
                  <li>Atteinte à la sécurité du Service</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  10.2 Résiliation
                </h3>
                <p>
                  Le Client peut résilier son compte à tout moment depuis les paramètres.
                  En cas de résiliation, les données seront conservées conformément à notre
                  politique de conservation.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              11. Modification des CGU
            </h2>
            <p>
              SIMA Creation Web se réserve le droit de modifier les présentes CGU à tout moment.
              Les modifications seront notifiées aux Clients et prendront effet 30 jours après
              notification. L'utilisation continue du Service vaut acceptation des nouvelles CGU.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              12. Droit Applicable et Juridiction
            </h2>
            <p className="mb-4">
              Les présentes CGU sont soumises au droit français.
            </p>
            <p>
              En cas de litige, et à défaut de résolution amiable, les tribunaux français
              seront seuls compétents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              13. Contact
            </h2>
            <p className="mb-4">Pour toute question concernant ces CGU :</p>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg space-y-2">
              <p><strong>SIMA Creation Web</strong></p>
              <p><strong>Email :</strong> legal@simacreationweb.com</p>
              <p><strong>Support :</strong> support@leaveone.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
