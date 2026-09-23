import { X, ExternalLink } from 'lucide-react';

// ============================================
// Centre d'aide — accessible à tout moment depuis le menu (et l'en-tête
// mobile). Chaque fonctionnalité est expliquée ET pointée : le bouton
// « Ouvrir » y mène directement. Rejoue aussi le tour de démarrage pour
// les conseillers qui l'ont sauté.
// ============================================

interface HelpCenterProps {
  isEs: boolean;
  onNavigate: (tab: string) => void;
  onOpenCheckup?: () => void;
  onReplayTour?: () => void;
  onClose: () => void;
}

interface HelpEntry {
  icon: string;
  title: string;
  description: string;
  /** Onglet cible du bouton « Ouvrir » ; 'checkup' ouvre le bilan du jour. */
  target: string;
}

const getEntries = (isEs: boolean): HelpEntry[] => [
  {
    icon: '🎯',
    title: isEs ? 'Objetivos del día' : 'Objectifs du jour',
    description: isEs
      ? 'Tu pantalla de inicio : tus objetivos del día (conversaciones, R1, R2, visitas, mensajes de pige), tu objetivo de mandatos del mes y tu CA. Toca una tarjeta para ir a la acción correspondiente.'
      : 'Ton écran d\'accueil : tes objectifs du jour (conversations, R1, R2, visites, messages de pige), ton objectif de mandats du mois et ton CA. Touche une tuile pour aller à l\'action correspondante.',
    target: 'dashboard',
  },
  {
    icon: '✅',
    title: isEs ? 'Hoy — mis acciones' : 'Aujourd\'hui — mes actions',
    description: isEs
      ? 'La lista de tus acciones del día, adaptada a tu nivel. Marca cada acción en cuanto la completes (un toque basta) y usa los contadores +/− para seguir tus números en tiempo real.'
      : 'La liste de tes actions du jour, adaptée à ton niveau. Coche chaque action dès qu\'elle est faite (un tap suffit) et utilise les compteurs +/− pour suivre tes chiffres en temps réel.',
    target: 'today',
  },
  {
    icon: '📋',
    title: isEs ? 'Balance del día — el ritual clave' : 'Bilan du jour — le rituel clé',
    description: isEs
      ? 'Cada noche (a partir de las 17 h), tómate 2 minutos para anotar tus resultados reales. Es lo que permite a la app adaptar tus días siguientes. Sin balance, la flecha « día siguiente » queda bloqueada.'
      : 'Chaque soir (dès 17 h), prends 2 minutes pour noter tes résultats réels. C\'est ce qui permet à l\'app d\'adapter tes journées suivantes. Sans bilan, la flèche « jour suivant » reste bloquée.',
    target: 'checkup',
  },
  {
    icon: '📝',
    title: isEs ? 'Informe de visita' : 'Compte rendu de visite',
    description: isEs
      ? 'Después de cada visita, anota las reacciones del comprador : la app redacta automáticamente el mensaje a enviar al vendedor. Todo tu historial de visitas está aquí, sincronizado en tu cuenta.'
      : 'Après chaque visite, note les réactions de l\'acquéreur : l\'app rédige automatiquement le message à envoyer au vendeur. Tout ton historique de visites est ici, synchronisé sur ton compte.',
    target: 'report',
  },
  {
    icon: '💰',
    title: isEs ? 'Comisión' : 'Commission',
    description: isEs
      ? 'Simula tu remuneración neta en cada venta (en % o en €), con tu palier, tus cargas y tus impuestos. Registra tus ventas para seguir tu CA del mes.'
      : 'Simule ta rémunération nette sur chaque vente (en % ou en €), avec ton palier, tes charges et tes impôts. Enregistre tes ventes pour suivre ton CA du mois.',
    target: 'commission',
  },
  {
    icon: '👥',
    title: isEs ? 'Contactos' : 'Contacts',
    description: isEs
      ? 'Tu libreta de prospectos : registra cada contacto, programa tus seguimientos y la app te avisa antes de que un contacto se enfríe. El botón 👤+ exporta la ficha al directorio de tu teléfono (.vcf).'
      : 'Ton carnet de prospects : enregistre chaque contact, programme tes relances et l\'app t\'alerte avant qu\'un contact ne refroidisse. Le bouton 👤+ exporte la fiche vers le répertoire de ton téléphone (.vcf).',
    target: 'contacts',
  },
  {
    icon: '📊',
    title: isEs ? 'Historial' : 'Historique',
    description: isEs
      ? 'Todos tus balances pasados y tus estadísticas por semana o mes : conversaciones, R1, R2, mandatos, visitas, ofertas. Ideal para ver tu progresión.'
      : 'Tous tes bilans passés et tes statistiques par semaine ou mois : conversations, R1, R2, mandats, visites, offres. Idéal pour voir ta progression.',
    target: 'history',
  },
  {
    icon: '🏆',
    title: isEs ? 'Mi recorrido' : 'Mon parcours',
    description: isEs
      ? 'Tu nivel de carrera y tus jalones : la app celebra tus etapas (primer mandato, primera venta, series de balances…).'
      : 'Ton niveau de carrière et tes jalons : l\'app célèbre tes étapes (premier mandat, première vente, séries de bilans…).',
    target: 'parcours',
  },
];

export function HelpCenter({ isEs, onNavigate, onOpenCheckup, onReplayTour, onClose }: HelpCenterProps) {
  const go = (target: string) => {
    onClose();
    if (target === 'checkup') onOpenCheckup?.();
    else onNavigate(target);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-gray-900">{isEs ? '❓ Ayuda — cómo usar la app' : '❓ Aide — comment utiliser l\'app'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          {isEs
            ? 'El ritmo diario : plan por la mañana, acciones marcadas en el día, balance por la noche. Todo lo que anotas se guarda en tu cuenta — lo encuentras en cualquier dispositivo.'
            : 'Le rythme quotidien : plan le matin, actions cochées dans la journée, bilan le soir. Tout ce que tu saisis est enregistré sur ton compte — tu le retrouves sur n\'importe quel appareil.'}
        </p>

        <div className="space-y-3">
          {getEntries(isEs).map(entry => (
            <div key={entry.target} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
              <span className="text-xl flex-shrink-0 mt-0.5">{entry.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{entry.title}</p>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{entry.description}</p>
              </div>
              <button
                onClick={() => go(entry.target)}
                className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium transition-colors"
              >
                {isEs ? 'Abrir' : 'Ouvrir'}
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {onReplayTour && (
          <button
            onClick={() => { onClose(); onReplayTour(); }}
            className="w-full mt-4 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            {isEs ? '▶️ Volver a ver el tour de inicio' : '▶️ Rejouer le tour de démarrage'}
          </button>
        )}
      </div>
    </div>
  );
}
