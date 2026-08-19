import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle, Home, Copy,
  User, MapPin, TrendingUp,
  BarChart3, AlertTriangle, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import type { VisitReport, VisitStatus } from '@/types';
import type { VisitStats } from '@/types';
import { VisitHistory } from './VisitHistory';

type ViewMode = 'form' | 'history';

interface VisitReportWriterProps {
  visits: VisitReport[];
  stats: VisitStats;
  onAddVisit: (visit: VisitReport) => void;
  onUpdateVisit: (id: string, updates: Partial<VisitReport>) => void;
  onDeleteVisit: (id: string) => void;
  onDeleteProperty?: (address: string) => void;
}

const statusLabels: Record<VisitStatus, { label: string; color: string }> = {
  intéressé: { label: 'Intéressé', color: 'bg-green-100 text-green-700 border-green-200' },
  réflexion: { label: 'En réflexion', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  négatif: { label: 'Négatif', color: 'bg-red-100 text-red-700 border-red-200' },
  offre: { label: 'Offre reçue !', color: 'bg-blue-100 text-blue-700 border-blue-200' },

};

const statusLabelsEs: Record<VisitStatus, string> = {
  intéressé: 'Interesado',
  réflexion: 'Lo está pensando',
  négatif: 'Negativo',
  offre: '¡Oferta recibida!',
};

type SellerCivility = 'M./Mme' | 'M.' | 'Mme';

// Infos de l'agent lues depuis la session (iad-coach-session) puis le profil
// local (iad-coach-profile-{email}) — le profil est prioritaire.
interface AgentInfo {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  language: 'fr' | 'es';
}

function readAgentInfo(): AgentInfo {
  const info: AgentInfo = { firstName: '', lastName: '', phone: '', city: '', language: 'fr' };
  try {
    const sessionRaw = localStorage.getItem('iad-coach-session');
    const session = sessionRaw ? JSON.parse(sessionRaw) : null;
    if (session?.firstName) info.firstName = String(session.firstName);
    if (session?.lastName) info.lastName = String(session.lastName);
    const email = session?.email;
    if (email) {
      const profileRaw = localStorage.getItem(`iad-coach-profile-${email}`);
      const profile = profileRaw ? JSON.parse(profileRaw) : null;
      if (profile?.firstName) info.firstName = String(profile.firstName);
      if (profile?.lastName) info.lastName = String(profile.lastName);
      if (profile?.phone) info.phone = String(profile.phone);
      if (profile?.city) info.city = String(profile.city);
      if (profile?.language === 'es') info.language = 'es';
    }
  } catch { /* ignore */ }
  return info;
}

// Reformulation diplomatique des notes brutes : règles par mots-clés,
// puis un encadrage neutre en fallback (la note brute n'est jamais
// recopiée telle quelle sans enrobage).
const DIPLOMATIC_RULES: { pattern: RegExp; replacement: { fr: string; es: string } }[] = [
  {
    pattern: /trop cher|prix\s+(jugé\s+)?(trop\s+)?(élevé|haut)|hors de prix|surestimé|au-dessus du marché/i,
    replacement: {
      fr: "Le prix a été perçu comme au-dessus de son budget et des références récentes du secteur",
      es: 'El precio se ha percibido por encima de su presupuesto y de las referencias recientes de la zona',
    },
  },
  {
    pattern: /cuisine.{0,30}(rénover|refaire|vieille|vétuste|vieillotte)|(rénover|refaire).{0,30}cuisine/i,
    replacement: {
      fr: 'Des travaux de rafraîchissement sont à prévoir côté cuisine',
      es: 'Hay que prever trabajos de actualización en la cocina',
    },
  },
  {
    pattern: /salle de bain.{0,30}(refaire|vieille|vétuste|vieillotte)|(refaire|rénover).{0,30}salle de bain/i,
    replacement: {
      fr: 'Des travaux de rafraîchissement sont à prévoir côté salle de bain',
      es: 'Hay que prever trabajos de actualización en el baño',
    },
  },
  {
    pattern: /bruyant|trop de bruit|bruit\s+(de la\s+)?(rue|route|voisin)/i,
    replacement: {
      fr: "L'environnement sonore a fait partie de ses réserves",
      es: 'El entorno sonoro ha sido una de sus reservas',
    },
  },
  {
    pattern: /trop (petit|sombre)|exigu|manque de (place|lumière)|sombre/i,
    replacement: {
      fr: "La surface ou la luminosité lui a semblé juste au regard de son projet",
      es: 'La superficie o la luminosidad le han parecido justas para su proyecto',
    },
  },
  {
    pattern: /jardin.{0,30}(petit|petite)|pas de jardin/i,
    replacement: {
      fr: "L'extérieur ne correspond pas tout à fait à ce qu'il recherche",
      es: 'El exterior no se ajusta del todo a lo que busca',
    },
  },
  {
    pattern: /loin|excentré|transport|éloigné/i,
    replacement: {
      fr: "La localisation l'a interrogé par rapport à ses habitudes",
      es: 'La ubicación le ha planteado dudas respecto a sus costumbres',
    },
  },
  {
    pattern: /travaux|à rénover|vétuste|rafraîchir/i,
    replacement: {
      fr: 'Des travaux sont à anticiper sur le bien',
      es: 'Hay que prever trabajos en el inmueble',
    },
  },
];

// Retours catégorisés qui sonnent positifs → ils alimentent les points positifs
const POSITIVE_PATTERN = /adore|adoré|coup de cœur|parfait|dans le budget|dans son budget|bien placé|calme|lumineux|aime|plaît|plait|super|top|ravi|conquis|ok\b/i;

function diplomatize(raw: string, isEs: boolean): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  for (const rule of DIPLOMATIC_RULES) {
    if (rule.pattern.test(trimmed)) return isEs ? rule.replacement.es : rule.replacement.fr;
  }
  // Fallback : on encadre la réserve sans recracher la note brute.
  // Minuscule en tête si la note commence par une majuscule non nécessaire.
  const note = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
  return isEs
    ? `Ha expresado una reserva sobre este punto: « ${note} »`
    : `Il a émis une réserve sur ce point : « ${note} »`;
}

// Découpe une note en lignes/puces exploitables
function splitLines(raw: string): string[] {
  return raw.split(/\n|•/).map(l => l.trim()).filter(Boolean);
}

export function VisitReportWriter({ visits, stats, onAddVisit, onUpdateVisit, onDeleteVisit, onDeleteProperty }: VisitReportWriterProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [sellerName, setSellerName] = useState('');
  const [sellerCivility, setSellerCivility] = useState<SellerCivility>('M./Mme');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [visitStatus, setVisitStatus] = useState<VisitStatus | null>(null);
  const [priceFeedback, setPriceFeedback] = useState('');
  const [locationFeedback, setLocationFeedback] = useState('');
  const [workFeedback, setWorkFeedback] = useState('');
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [weakPoints, setWeakPoints] = useState('');
  const [strongPoints, setStrongPoints] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [savedRecap, setSavedRecap] = useState<{ address: string; seller: string; statusLabel: string } | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<AgentInfo | null>(null);
  if (agentRef.current === null) agentRef.current = readAgentInfo();
  const agent = agentRef.current;
  const isEs = agent.language === 'es';

  const statusText = (s: VisitStatus) => (isEs ? statusLabelsEs[s] : statusLabels[s].label);
  const civilityText = (c: SellerCivility) =>
    !isEs ? c : c === 'M.' ? 'Sr.' : c === 'Mme' ? 'Sra.' : 'Sr./Sra.';

  // Scroll en haut au montage
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Extraire les biens uniques des visites existantes
  const existingProperties = Array.from(new Map(visits.map(v => [v.propertyAddress, v])).values());
  const [selectedPropertyAddress, setSelectedPropertyAddress] = useState('');

  const selectExistingProperty = (address: string) => {
    const existing = visits.find(v => v.propertyAddress === address);
    if (existing) {
      setSellerName(existing.sellerName);
      setPropertyAddress(existing.propertyAddress);
      setBuyerName('');
      setSelectedPropertyAddress(address);
    }
  };

  const generateMessage = () => {
    if (!visitStatus) return;
    const date = new Date().toLocaleDateString(isEs ? 'es-ES' : 'fr-FR');
    const statusLabel = statusText(visitStatus);

    // Points positifs : points d'appui + retours catégorisés positifs
    const positiveLines: string[] = [...splitLines(strongPoints)];
    // Points de vigilance : points faibles + retours catégorisés négatifs/neutres
    const vigilanceLines: string[] = splitLines(weakPoints).map(l => diplomatize(l, isEs));

    const categories: { label: string; value: string }[] = [
      { label: 'Prix', value: priceFeedback },
      { label: 'Emplacement', value: locationFeedback },
      { label: 'Travaux', value: workFeedback },
      { label: 'Général', value: generalFeedback },
    ];
    for (const cat of categories) {
      for (const line of splitLines(cat.value)) {
        if (POSITIVE_PATTERN.test(line)) {
          positiveLines.push(line);
        } else {
          vigilanceLines.push(diplomatize(line, isEs));
        }
      }
    }

    if (positiveLines.length === 0) {
      positiveLines.push(isEs
        ? 'Su inmueble ha captado toda la atención del comprador durante la visita.'
        : "Votre bien a retenu toute l'attention de l'acquéreur pendant la visite.");
    }
    if (vigilanceLines.length === 0) {
      vigilanceLines.push(isEs
        ? 'No se ha expresado ninguna reserva en particular.'
        : "Aucune réserve particulière n'a été exprimée.");
    }

    // Prochaine étape selon le statut
    let nextStep = '';
    if (visitStatus === 'intéressé') {
      nextStep = "L'acquéreur est intéressé : je reste en contact rapproché avec lui pour faire avancer le dossier, et je vous tiens informé en temps réel.";
    } else if (visitStatus === 'réflexion') {
      nextStep = "L'acquéreur prend le temps de la réflexion — c'est bon signe. Je le relance sous 48 h pour répondre à ses questions et l'accompagner dans sa décision.";
    } else if (visitStatus === 'négatif') {
      nextStep = "Ce retour est précieux : il m'aide à affiner le profil des prochains visiteurs pour vous présenter uniquement des acquéreurs vraiment en phase avec votre bien.";
    } else if (visitStatus === 'offre') {
      nextStep = "Très bonne nouvelle : l'acquéreur souhaite faire une offre. Je la prépare avec lui et je reviens vers vous très rapidement avec tous les détails.";
    }

    const greeting = sellerName.trim()
      ? `Bonjour ${civilityText(sellerCivility)} ${sellerName.trim()},`
      : 'Bonjour,';
    const visitLine = buyerName.trim()
      ? `Je reviens vers vous suite à la visite de votre bien du ${date} avec ${buyerName.trim()}.`
      : `Je reviens vers vous suite à la visite de votre bien du ${date}.`;

    const signatureLines: string[] = [];
    const fullName = `${agent.firstName} ${agent.lastName}`.trim();
    if (fullName) signatureLines.push(fullName);
    if (agent.phone) signatureLines.push(agent.phone);

    const msg = `${greeting}

${visitLine} Voici mon retour, en toute transparence.

Statut de l'acquéreur : ${statusLabel}

Ce que l'acquéreur a retenu :
${positiveLines.map(l => `• ${l}`).join('\n')}

Ses réserves :
${vigilanceLines.map(l => `• ${l}`).join('\n')}

La suite : ${nextStep}

N'hésitez pas si vous avez la moindre question — je suis joignable directement.

Bien cordialement,${signatureLines.length ? `\n${signatureLines.join('\n')}` : ''}`;

    setGeneratedMessage(msg);
  };

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedMessage);
      } else {
        // Fallback pour les navigateurs qui ne supportent pas clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = generatedMessage;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success('Message copié ✓');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail
    }
  };

  const handleSave = () => {
    if (!propertyAddress.trim() || !sellerName.trim() || !visitStatus) return;

    const newVisit: VisitReport = {
      id: `visit-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      propertyAddress: propertyAddress.trim(),
      sellerName: sellerName.trim(),
      sellerPhone: '',
      buyerName: buyerName.trim(),
      visitType: 'acheteur',
      status: visitStatus,
      rawFeedback: `${priceFeedback} ${locationFeedback} ${workFeedback} ${generalFeedback}`.trim(),
      keyPoints: keyPoints.trim(),
      weakPoints: weakPoints.trim(),
      strongPoints: strongPoints.trim(),
      priceFeedback: priceFeedback.trim(),
      locationFeedback: locationFeedback.trim(),
      workFeedback: workFeedback.trim(),
      generalFeedback: generalFeedback.trim(),
      generatedMessage: '',
      followUpDate: '',
      notes: notes.trim(),
    };

    onAddVisit(newVisit);

    // Confirmation + récap de la fiche enregistrée
    setSaved(true);
    setSavedRecap({
      address: propertyAddress.trim(),
      seller: `${sellerCivility} ${sellerName.trim()}`,
      statusLabel: statusLabels[visitStatus]?.label || visitStatus,
    });
    toast.success('Compte rendu enregistré ✓');
    setTimeout(() => setSaved(false), 3000);

    // Reset form + efface le message généré affiché
    setGeneratedMessage('');
    setSellerName('');
    setSellerCivility('M./Mme');
    setPropertyAddress('');
    setBuyerName('');
    setVisitStatus(null);
    setPriceFeedback('');
    setLocationFeedback('');
    setWorkFeedback('');
    setGeneralFeedback('');
    setWeakPoints('');
    setStrongPoints('');
    setKeyPoints('');
    setNotes('');
  };

  if (viewMode === 'history') {
    return (
      <VisitHistory
        visits={visits}
        stats={stats}
        onBack={() => setViewMode('form')}
        onDeleteVisit={onDeleteVisit}
        onDeleteProperty={onDeleteProperty || (() => {})}
        onUpdateVisit={onUpdateVisit}
      />
    );
  }

  return (
    <div ref={topRef} className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Home className="w-6 h-6 text-red-600" />
            Compte rendu de visite
          </h2>
          <p className="text-gray-500 mt-1">Garde une trace du retour de chaque visite pour tes RDV de suivi</p>
        </div>
        <Button variant="outline" onClick={() => setViewMode('history')} className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Historique ({visits.length})
        </Button>
      </div>

      {/* Sélecteur de biens existants */}
      {existingProperties.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <Label className="text-sm font-semibold text-blue-800 mb-2 block">Bien déjà enregistré ?</Label>
            <select
              onChange={e => { if (e.target.value) { selectExistingProperty(e.target.value); } else { setSelectedPropertyAddress(''); } }}
              className="w-full p-2.5 rounded-lg border border-blue-200 bg-white text-sm"
              value={selectedPropertyAddress}
            >
              <option value="">Sélectionner un bien existant...</option>
              {existingProperties.map(p => (
                <option key={p.propertyAddress} value={p.propertyAddress}>{p.propertyAddress} — {p.sellerName}</option>
              ))}
            </select>
            {selectedPropertyAddress && (
              <p className="text-xs text-blue-600 mt-1">✓ Bien sélectionné — Nom du vendeur et adresse pré-remplis</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Infos vendeur & bien */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><User className="w-4 h-4 text-red-500" /> Infos vendeur & bien</h3>
          <div className="grid grid-cols-1 md:grid-cols-[110px_1fr_1fr] gap-4">
            <div>
              <Label className="text-xs">Civilité</Label>
              <select
                value={sellerCivility}
                onChange={e => setSellerCivility(e.target.value as SellerCivility)}
                className="mt-1 w-full h-9 rounded-md border border-input bg-white px-2 text-sm"
              >
                <option value="M./Mme">M./Mme</option>
                <option value="M.">M.</option>
                <option value="Mme">Mme</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Nom du vendeur *</Label>
              <Input value={sellerName} onChange={e => setSellerName(e.target.value)} placeholder="Ex : Dupont" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Nom de l'acquéreur</Label>
              <Input value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Ex : Martin" className="mt-1" />
            </div>
            <div className="md:col-span-3">
              <Label className="text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> Adresse du bien *</Label>
              <Input value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} placeholder={agent.city ? `Ex : 12 rue des Lilas, ${agent.city}` : 'Ex : 12 rue des Lilas, 66000 Perpignan'} className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statut */}
      <div>
        <Label className="text-sm font-semibold text-gray-900 mb-2 block">Résultat de la visite</Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {(['intéressé', 'réflexion', 'négatif', 'offre'] as VisitStatus[]).map(s => (
            <button key={s} onClick={() => setVisitStatus(s)}
              className={`p-2 rounded-lg border text-xs font-medium transition-all ${visitStatus === s ? statusLabels[s].color + ' border-current' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
              {statusLabels[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Retours par catégorie — TOUJOURS VISIBLES */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500" /> Retours de l'acheteur — Dès qu'un sujet est abordé, note-le ici</h3>

          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-500 font-medium">💰 Retour sur le PRIX</Label>
              <Textarea value={priceFeedback} onChange={e => setPriceFeedback(e.target.value)} placeholder="Ex : « Trop cher par rapport au marché », « Dans le budget », « Il demande à voir les comparables »…" className="mt-1" rows={2} />
            </div>
            <div>
              <Label className="text-xs text-gray-500 font-medium">📍 Retour sur l'EMPLACEMENT</Label>
              <Textarea value={locationFeedback} onChange={e => setLocationFeedback(e.target.value)} placeholder="Ex : « Il adore le quartier », « Trop bruyant », « Bien placé près des écoles »…" className="mt-1" rows={2} />
            </div>
            <div>
              <Label className="text-xs text-gray-500 font-medium">🔧 Retour sur les TRAVAUX</Label>
              <Textarea value={workFeedback} onChange={e => setWorkFeedback(e.target.value)} placeholder="Ex : « Cuisine à refaire », « Électricité OK », « Salle de bain vieillotte »…" className="mt-1" rows={2} />
            </div>
            <div>
              <Label className="text-xs text-gray-500 font-medium">📝 Retours GÉNÉRAUX</Label>
              <Textarea value={generalFeedback} onChange={e => setGeneralFeedback(e.target.value)} placeholder="Tous les autres retours bruts de l'acheteur..." className="mt-1" rows={2} />
            </div>
          </div>

          {/* Indicateurs visuels de remplissage */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-gray-100">
            <div className={`p-2 rounded-lg border text-center ${priceFeedback ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
              <p className="text-xs text-gray-500">Prix</p>
              <p className="text-xs font-medium text-gray-700">{priceFeedback ? '✓ Noté' : '—'}</p>
            </div>
            <div className={`p-2 rounded-lg border text-center ${locationFeedback ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
              <p className="text-xs text-gray-500">Emplacement</p>
              <p className="text-xs font-medium text-gray-700">{locationFeedback ? '✓ Noté' : '—'}</p>
            </div>
            <div className={`p-2 rounded-lg border text-center ${workFeedback ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
              <p className="text-xs text-gray-500">Travaux</p>
              <p className="text-xs font-medium text-gray-700">{workFeedback ? '✓ Noté' : '—'}</p>
            </div>
            <div className={`p-2 rounded-lg border text-center ${generalFeedback ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
              <p className="text-xs text-gray-500">Général</p>
              <p className="text-xs font-medium text-gray-700">{generalFeedback ? '✓ Noté' : '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points faibles soulevés */}
      <div>
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-500" /> Points faibles soulevés par l'acquéreur</Label>
        <Textarea value={weakPoints} onChange={e => setWeakPoints(e.target.value)} placeholder="Ce qui a posé question, les inquiétudes, les objections..." className="mt-1" rows={2} />
      </div>

      {/* Points sur lesquels appuyer dans le message */}
      <div>
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" /> Points sur lesquels appuyer dans le message</Label>
        <Textarea value={strongPoints} onChange={e => setStrongPoints(e.target.value)} placeholder="Les atouts du bien à mettre en avant dans ton retour au vendeur..." className="mt-1" rows={2} />
      </div>

      {/* Notes */}
      <div>
        <Label className="text-sm font-medium text-gray-700">Notes privées (pas dans le message)</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Pour ton suivi interne uniquement..." className="mt-1" rows={2} />
      </div>

      {/* Génération de message type */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Message type pour le vendeur</h3>
          </div>
          <p className="text-sm text-blue-600 mb-3">
            Génère un message récapitulatif prêt à envoyer à ton vendeur. Il reprend le statut de l&apos;acquéreur, les points positifs, les points de vigilance et la prochaine étape.
          </p>
          <Button
            onClick={generateMessage}
            disabled={!visitStatus}
            variant="outline"
            className="w-full bg-white border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
          >
            <FileText className="w-4 h-4 mr-2" /> Générer le message type
          </Button>
          {!visitStatus && (
            <p className="text-xs text-blue-500 mt-2">Choisis d&apos;abord le résultat de la visite pour générer le message.</p>
          )}

          {generatedMessage && (
            <div className="mt-4 space-y-3">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{generatedMessage}</pre>
              </div>
              <p className="text-xs text-blue-600">
                ✏️ Message reformulé pour rester diplomatique — relis avant d&apos;envoyer. Tes notes brutes restent privées et ne partent jamais au vendeur.
              </p>
              <Button
                onClick={copyToClipboard}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {copied ? (
                  <>✓ Copié !</>
                ) : (
                  <><Copy className="w-4 h-4 mr-2" /> Copier le message</>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save button */}
      <Button
        onClick={handleSave}
        disabled={!sellerName.trim() || !propertyAddress.trim() || !visitStatus}
        className="w-full bg-red-600 hover:bg-red-700 py-3 text-base disabled:opacity-50"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        {saved
          ? (isEs ? 'Informe guardado ✓' : 'Compte rendu enregistré ✓')
          : (isEs ? 'Guardar el informe' : 'Enregistrer le compte rendu')}
      </Button>

      {!visitStatus && sellerName.trim() && propertyAddress.trim() && (
        <p className="text-center text-sm text-amber-600">
          {isEs
            ? 'Elija el resultado de la visita (Interesado, En reflexión, Negativo u Oferta) para poder guardar.'
            : 'Choisis le résultat de la visite (Intéressé, En réflexion, Négatif ou Offre) pour pouvoir enregistrer.'}
        </p>
      )}

      {saved && savedRecap && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-1">
          <p className="text-sm font-semibold text-green-700">Compte rendu enregistré ✓</p>
          <p className="text-sm text-green-700">
            {savedRecap.address} — Vendeur : {savedRecap.seller} — Statut : {savedRecap.statusLabel}
          </p>
          <p className="text-xs text-green-600">
            Tu pourras le consulter dans l&apos;historique pour tes RDV de suivi.
          </p>
        </div>
      )}
    </div>
  );
}
