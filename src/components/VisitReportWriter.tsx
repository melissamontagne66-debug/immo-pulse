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

export function VisitReportWriter({ visits, stats, onAddVisit, onUpdateVisit, onDeleteVisit, onDeleteProperty }: VisitReportWriterProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [sellerName, setSellerName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [visitStatus, setVisitStatus] = useState<VisitStatus>('intéressé');
  const [priceFeedback, setPriceFeedback] = useState('');
  const [locationFeedback, setLocationFeedback] = useState('');
  const [workFeedback, setWorkFeedback] = useState('');
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [weakPoints, setWeakPoints] = useState('');
  const [strongPoints, setStrongPoints] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

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
    const date = new Date().toLocaleDateString('fr-FR');
    const statusLabel = statusLabels[visitStatus]?.label || visitStatus;

    let msg = `Bonjour ${sellerName || 'madame, monsieur'},

Suite à la visite du ${date}${buyerName ? ` avec ${buyerName}` : ''}, voici mon retour :

**Statut de l'acquéreur :** ${statusLabel}

`;

    // Points positifs
    if (strongPoints.trim()) {
      msg += `**Points positifs :**
${strongPoints}

`;
    }

    // Points négatifs
    if (weakPoints.trim()) {
      msg += `**Points à prendre en compte :**
${weakPoints}

`;
    }

    // Retours par catégorie
    const hasCategoryFeedback = priceFeedback.trim() || locationFeedback.trim() || workFeedback.trim() || generalFeedback.trim();
    if (hasCategoryFeedback) {
      msg += `**Retours détaillés :**
`;
      if (priceFeedback.trim()) msg += `• Prix : ${priceFeedback}\n`;
      if (locationFeedback.trim()) msg += `• Emplacement : ${locationFeedback}\n`;
      if (workFeedback.trim()) msg += `• Travaux : ${workFeedback}\n`;
      if (generalFeedback.trim()) msg += `• Général : ${generalFeedback}\n`;
      msg += `
`;
    }

    // Prochaines étapes selon le statut
    if (visitStatus === 'intéressé') {
      msg += `**Prochaine étape :** Je reste en contact rapproché avec l'acquéreur pour faire avancer le dossier. Je vous tiens informé s'il y a du nouveau.`;
    } else if (visitStatus === 'réflexion') {
      msg += `**Prochaine étape :** L'acquéreur réfléchit et compare. Je fais un suivi dans les 48h pour l'accompagner dans sa décision.`;
    } else if (visitStatus === 'négatif') {
      msg += `**Prochaine étape :** Ce retour m'aide à affiner ma stratégie. Je vais cibler davantage les prochains visiteurs et vous trouver le bon acquéreur.`;
    } else if (visitStatus === 'offre') {
      msg += `**Prochaine étape :** Excellente nouvelle ! Je prépare l'offre avec l'acquéreur et vous contacte très vite avec les détails.`;
    }

    msg += `

Bonne journée,
[Votre nom]`;

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
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail
    }
  };

  const handleSave = () => {
    if (!propertyAddress.trim() || !sellerName.trim()) return;

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

    // Show saved confirmation
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

    // Reset form
    setSellerName('');
    setPropertyAddress('');
    setBuyerName('');
    setVisitStatus('intéressé');
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Nom du vendeur *</Label>
              <Input value={sellerName} onChange={e => setSellerName(e.target.value)} placeholder="Ex: Dupont" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Nom de l'acquéreur</Label>
              <Input value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Ex: Martin" className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> Adresse du bien *</Label>
              <Input value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} placeholder="Ex: 12 rue des Lilas, 66000 Perpignan" className="mt-1" />
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
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500" /> Retours de l'acheteur — Dès qu'on touche un sujet, note-le ici</h3>

          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-500 font-medium">💰 Retour sur le PRIX</Label>
              <Textarea value={priceFeedback} onChange={e => setPriceFeedback(e.target.value)} placeholder="Ex: 'Trop cher par rapport au marché', 'Dans le budget', 'Demande à voir les comparables'..." className="mt-1" rows={2} />
            </div>
            <div>
              <Label className="text-xs text-gray-500 font-medium">📍 Retour sur l'EMPLACEMENT</Label>
              <Textarea value={locationFeedback} onChange={e => setLocationFeedback(e.target.value)} placeholder="Ex: 'Adore le quartier', 'Trop bruyant', 'Bien placé près des écoles'..." className="mt-1" rows={2} />
            </div>
            <div>
              <Label className="text-xs text-gray-500 font-medium">🔧 Retour sur les TRAVAUX</Label>
              <Textarea value={workFeedback} onChange={e => setWorkFeedback(e.target.value)} placeholder="Ex: 'Cuisine à refaire', 'Électricité OK', 'Salle de bain vieillotte'..." className="mt-1" rows={2} />
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
            Génère un message récapitulatif prêt à envoyer à ton vendeur. Il reprend le statut de l&apos;acquéreur, les points positifs et négatifs, et les prochaines étapes.
          </p>
          <Button
            onClick={generateMessage}
            variant="outline"
            className="w-full bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <FileText className="w-4 h-4 mr-2" /> Générer le message type
          </Button>

          {generatedMessage && (
            <div className="mt-4 space-y-3">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{generatedMessage}</pre>
              </div>
              <Button
                onClick={copyToClipboard}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {copied ? (
                  <>✓ Copié !</>
                ) : (
                  <><Copy className="w-4 h-4 mr-2" /> Copier le message en un clic</>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save button */}
      <Button
        onClick={handleSave}
        disabled={!sellerName.trim() || !propertyAddress.trim()}
        className="w-full bg-red-600 hover:bg-red-700 py-3 text-base disabled:opacity-50"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        {saved ? 'Compte rendu enregistré !' : 'Enregistrer le compte rendu'}
      </Button>

      {saved && (
        <p className="text-center text-sm text-green-600">
          Le compte rendu est sauvegardé. Tu pourras le consulter dans l&apos;historique pour tes RDV de suivi.
        </p>
      )}
    </div>
  );
}
