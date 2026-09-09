import { Button } from '@/components/ui/button';

// Politique de confidentialité — partagée entre l'écran de connexion et le
// menu de l'app (Layout) pour être accessible une fois connecté.
export function PrivacyPolicyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Politique de confidentialité</h3>
        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <p><strong className="text-gray-900">Responsable de traitement&nbsp;:</strong> l'éditeur de l'application Immo Pulse, qui met ce service à votre disposition dans le cadre de votre activité professionnelle.</p>
          <p><strong className="text-gray-900">Finalité&nbsp;:</strong> vos données (profil, bilans quotidiens, comptes rendus de visite, statistiques) sont traitées uniquement pour faire fonctionner le service de coaching et vous restituer votre historique et vos résultats.</p>
          <p><strong className="text-gray-900">Stockage&nbsp;:</strong> vos données sont enregistrées sur votre appareil (stockage local du navigateur) et synchronisées de façon sécurisée sur votre compte, hébergé par Cloudflare (Workers et base de données D1), afin que vous les retrouviez sur n'importe quel appareil.</p>
          <p><strong className="text-gray-900">Durée de conservation&nbsp;:</strong> vos données sont conservées tant que votre compte est actif, à une exception près&nbsp;: les fiches de vos prospects sans aucune interaction (appel, note, relance ou modification) pendant 90 jours sont automatiquement et définitivement supprimées, sur votre appareil comme sur votre compte (principe de minimisation — pensez à basculer vos prospects qualifiés sur l'intranet de votre réseau avant ce délai). La suppression de votre compte entraîne la suppression de l'ensemble de vos données.</p>
          <p><strong className="text-gray-900">Vos droits&nbsp;:</strong> vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Vous pouvez les exercer à tout moment depuis les réglages de l'application, notamment en supprimant votre compte.</p>
          <p><strong className="text-gray-900">Données de tiers&nbsp;:</strong> les contacts que vous saisissez (prospects, vendeurs) relèvent de votre responsabilité professionnelle. Informez ces personnes et supprimez leurs données dès qu'elles ne sont plus utiles.</p>
          <p><strong className="text-gray-900">Extension « Bridge CRM »&nbsp;:</strong> si vous installez et utilisez l'extension Chrome Bridge CRM, vos contacts (prospects) sont transmis, à votre initiative et après connexion à votre compte, vers le CRM de votre réseau pour y être importés. Ce transfert ne concerne que vos fiches contacts (pas vos bilans, ventes ni données de coaching) et relève de votre responsabilité professionnelle envers les personnes concernées. La suppression d'un contact dans l'application est totale et immédiate ; pensez à supprimer la fiche correspondante dans le CRM si nécessaire.</p>
          <p><strong className="text-gray-900">Contact&nbsp;:</strong> pour toute question ou demande relative à vos données personnelles, contactez le responsable du service via les coordonnées communiquées par votre organisation.</p>
        </div>
        <Button onClick={onClose} className="w-full mt-6 bg-red-600 hover:bg-red-700">
          Fermer
        </Button>
      </div>
    </div>
  );
}
