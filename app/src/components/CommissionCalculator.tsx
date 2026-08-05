import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { formatEuro, clampNumber } from '@/lib/utils';
import { Euro, Calculator, TrendingUp, User, Percent, Minus, Equal, Trash2, Save, AlertCircle, HandCoins } from 'lucide-react';

// Grille de commission-type (degressive) — suggestion par defaut
function getCommissionRate(price: number): number {
  if (price <= 50000) return 9.0;
  if (price <= 100000) return 8.0;
  if (price <= 150000) return 6.5;
  if (price <= 200000) return 5.5;
  if (price <= 300000) return 5.0;
  if (price <= 500000) return 4.5;
  return 4.0;
}

interface Simulation {
  id: number;
  nomVente: string;
  prixVente: number;
  tauxCommission: number;
  commissionTTC: number;
  commissionHT: number;
  apporteur: number;
  pallier: number;
  impotPourcent: number;
}

// Palliers de commission : France 69-85%, Espagne 69-87%
const PALLIERS_FRANCE = [69, 75, 80, 85];
const PALLIERS_ESPAGNE = [69, 75, 80, 87];

// Charges sociales auto-entrepreneur France (NAF 6831Z : activité immobilière)
const CHARGES_AE_FR = 0.212; // 21.2%
// Charges sociales auto-entrepreneur Espagne (autonomo)
const CHARGES_AE_ES = 0.128; // ~12.8% (simplifié)

// TVA
const TVA_RATE = 0.20; // 20%

interface CommissionCalculatorProps {
  userKey?: string;
  country?: 'france' | 'spain';
}

export function CommissionCalculator({ userKey, country = 'france' }: CommissionCalculatorProps) {
  const isSpain = country === 'spain';
  const PALLIERS = isSpain ? PALLIERS_ESPAGNE : PALLIERS_FRANCE;
  const CHARGES_AE = isSpain ? CHARGES_AE_ES : CHARGES_AE_FR;
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const [prixVente, setPrixVente] = useState(250000);
  const [prixVenteInput, setPrixVenteInput] = useState(prixVente.toString());
  const [tauxCommissionManual, setTauxCommissionManual] = useState<number | null>(null);
  const [apporteurMontant, setApporteurMontant] = useState(0);
  const [fraisNotaire, setFraisNotaire] = useState(0);
  const [impotPourcent, setImpotPourcent] = useState(2.2); // defaut impot liberatoire
  const [isTVAFranchise, setIsTVAFranchise] = useState(false);
  const STORAGE_KEY = userKey ? `immo-pulse-simulations-${userKey}` : 'immo-pulse-simulations';

  const [simulations, setSimulations] = useState<Simulation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return [];
  });
  const [nomVente, setNomVente] = useState('');
  const [pallier, setPallier] = useState(75);

  // Taux de commission (manuel ou auto)
  const tauxCommissionAuto = getCommissionRate(prixVente);
  const tauxCommission = tauxCommissionManual !== null ? tauxCommissionManual : tauxCommissionAuto;

  // Calculs dans l'ordre correct :
  // 1. Commission TTC = Prix × Taux%
  // 2. Commission HT = TTC / 1.20 (on retire la TVA) sauf franchise de TVA
  // 3. Net avec pallier = HT × (pallier/100) → CE QUE LE CONSEILLER ENCASSE
  // 4. Sur ce montant : Charges AE + Impôt libératoire
  // 5. Net final = Net pallier - Charges - Impôt - apporteur - frais
  const commissionTTC = Math.round(prixVente * (tauxCommission / 100));
  const commissionHT = isTVAFranchise
    ? commissionTTC
    : Math.round(commissionTTC / (1 + TVA_RATE));
  // Pallier appliqué sur le HT → c'est ce que le conseiller touche
  const netAvecPallier = Math.round(commissionHT * (pallier / 100));
  // Charges et impôt s'appliquent sur ce que le conseiller encaisse
  const chargesSociales = Math.round(netAvecPallier * CHARGES_AE);
  const impotLiberatoire = Math.round(netAvecPallier * (impotPourcent / 100));
  const netFinal = netAvecPallier - chargesSociales - impotLiberatoire - apporteurMontant - fraisNotaire;

  const saveSimulation = () => {
    if (!nomVente.trim()) return;
    const newId = simulations.length > 0 ? Math.max(...simulations.map(s => s.id)) + 1 : 1;
    const newSim: Simulation = {
      id: newId,
      nomVente: nomVente.trim(),
      prixVente,
      tauxCommission,
      commissionTTC,
      commissionHT,
      apporteur: apporteurMontant,
      pallier,
      impotPourcent,
    };
    const updated = [...simulations, newSim];
    setSimulations(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setNomVente('');
  };

  const removeSimulation = (id: number) => {
    const updated = simulations.filter(s => s.id !== id);
    setSimulations(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div ref={topRef} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-red-600" />
            {isSpain ? 'Calculadora de comisión' : 'Calculateur de commission'}
          </h2>
          <p className="text-gray-500 mt-1">{isSpain ? 'Simula tu comisión como autónomo en cada venta' : 'Simule ta commission en tant qu\'auto-entrepreneur sur chaque vente'}</p>
        </div>
      </div>

      {/* Avertissement */}
      <Card className="bg-amber-50 border-amber-300">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                {isSpain ? 'Esta herramienta es una estimación informativa' : 'Cet outil est une estimation informative'}
              </p>
              <p className="text-xs text-amber-700 mt-1">
                {isSpain
                  ? 'Los cálculos dependen de tu situación personal particular (estatus fiscal, deducciones, acuerdos específicos, etc.). Te recomendamos verificar con tu contable para una estimación precisa.'
                  : 'Les calculs dépendent de ta situation personnelle particulière (statut fiscal, déductions, accords spécifiques, etc.). Nous te recommandons de vérifier avec ton comptable pour une estimation précise.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick calculate */}
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Euro className="w-5 h-5 text-red-600" /> {isSpain ? 'Cálculo rápido' : 'Calcul rapide'}
          </h3>

          {/* Prix de vente */}
          <div>
            <div className="flex items-center justify-between mb-2 gap-4 flex-wrap">
            <Label>{isSpain ? 'Precio de venta del bien' : 'Prix de vente du bien'}</Label>
            <div className="text-right">
              <div className="text-base font-bold text-red-600">{formatEuro(prixVente)}</div>
              <div className="text-xs text-gray-500">{isSpain ? 'Introduce el precio previsto de venta' : 'Saisis le prix de vente prévu'}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 mb-4">
            <div>
              <Label className="text-sm text-gray-700">{isSpain ? 'Precio exacto' : 'Prix exact'}</Label>
              <Input
                type="number"
                min={30000}
                max={2000000}
                step={1000}
                value={prixVenteInput}
                onChange={e => setPrixVenteInput(e.target.value)}
                onBlur={() => {
                  const value = clampNumber(Number(prixVenteInput), 30000, 2000000);
                  setPrixVente(value);
                  setPrixVenteInput(String(value));
                }}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-700">{isSpain ? 'Selector rápido' : 'Curseur rapide'}</Label>
              <Slider value={[prixVente]} onValueChange={v => {
                setPrixVente(v[0]);
                setPrixVenteInput(String(v[0]));
              }} min={30000} max={2000000} step={5000} />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>30k€</span><span>400k€</span><span>800k€</span><span>2M€</span></div>
            </div>
          </div>          </div>
          {/* Taux de commission : auto + modifiable */}
          <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-3">
            <div className="flex items-center gap-3">
              <Percent className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{isSpain ? '% de comisión sobre la venta' : '% de commission sur la vente'}</p>
                <p className="text-xs text-gray-500">{isSpain ? 'Grilla decreciente sugerida — puedes modificarla a mano' : 'Grille dégressive suggérée — tu peux la modifier à la main'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={tauxCommissionManual !== null ? tauxCommissionManual : tauxCommissionAuto}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setTauxCommissionManual(isNaN(val) ? null : clampNumber(val, 0.1, 20));
                  }}
                  className="w-20 text-center font-bold text-purple-700"
                  step={0.1}
                  min={0.1}
                  max={20}
                />
                <span className="text-sm font-semibold text-purple-700">%</span>
              </div>
            </div>
            {tauxCommissionManual !== null && (
              <button
                onClick={() => setTauxCommissionManual(null)}
                className="text-xs text-purple-600 hover:text-purple-800 underline"
              >
                {isSpain ? 'Restablecer automático' : 'Rétablir le taux automatique'}
              </button>
            )}
          </div>

          {/* Impôt libératoire */}
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-3">
              <HandCoins className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{isSpain ? 'Impuesto liberatorio (%)' : 'Impôt libératoire (%)'}</p>
                <p className="text-xs text-gray-500">{isSpain ? 'Introduce el % de impuesto liberatorio que te aplica' : 'Renseigne le % d\'impôt libératoire qui t\'applique'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={impotPourcent}
                  onChange={e => setImpotPourcent(clampNumber(Number(e.target.value), 0, 15))}
                  className="w-20 text-center font-bold text-indigo-700"
                  step={0.1}
                  min={0}
                  max={15}
                />
                <span className="text-sm font-semibold text-indigo-700">%</span>
              </div>
            </div>
          </div>

          {/* Pallier de commission */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" /> {isSpain ? '¿A qué palier estás en este bien?' : 'À quel pallier es-tu sur ce bien ?'}
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {PALLIERS.map(p => (
                <button
                  key={p}
                  onClick={() => setPallier(p)}
                  className={`p-3 rounded-lg border text-sm font-semibold transition-all ${
                    pallier === p
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  {p}%
                  <span className="block text-xs font-normal mt-0.5 text-gray-400">{isSpain ? 'en tu bolsillo' : 'dans ta poche'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Apporteur + Frais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2"><User className="w-4 h-4 text-orange-500" /> {isSpain ? 'Colaborador de negocios (€)' : "Apporteur d'affaires (€)"}</Label>
              <Input type="number" value={apporteurMontant || ''} onChange={e => setApporteurMontant(clampNumber(Number(e.target.value), 0, 1000000))} placeholder="0" className="mt-1" />
            </div>
            <div>
              <Label className="flex items-center gap-2"><Minus className="w-4 h-4 text-gray-400" /> {isSpain ? 'Otros gastos (€)' : 'Autres frais (€)'}</Label>
              <Input type="number" value={fraisNotaire || ''} onChange={e => setFraisNotaire(clampNumber(Number(e.target.value), 0, 1000000))} placeholder="0" className="mt-1" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <Checkbox
              id="tva-franchise"
              checked={isTVAFranchise}
              onCheckedChange={value => setIsTVAFranchise(Boolean(value))}
              className="mr-2"
            />
            <label htmlFor="tva-franchise" className="text-sm text-gray-700">
              {isSpain ? 'Régimen de franquicia de IVA (sin TVA)' : 'Franchise de TVA (sans TVA)'}
            </label>
          </div>

          {/* Résultat */}
          <div className="bg-white rounded-xl p-5 border-2 border-green-200 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Equal className="w-5 h-5 text-green-600" />
              <p className="font-semibold text-gray-900">{isSpain ? 'Resultado de la simulación' : 'Résultat de la simulation'}</p>
            </div>

            {/* Détails du calcul */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-600">{isSpain ? 'Comisión TTC' : 'Commission TTC'}</span>
                <span className="font-semibold text-gray-900">{commissionTTC.toLocaleString()} €</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-600">{isTVAFranchise ? (isSpain ? 'Franquicia IVA' : 'Franchise TVA') : (isSpain ? 'Retirar IVA (20%)' : 'Retirer TVA (20%)')}</span>
                <span className="font-medium text-purple-700">-{isTVAFranchise ? '0 €' : `${formatEuro(commissionTTC - commissionHT)}`}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-900 font-medium">{isSpain ? '= Comisión HT' : '= Commission HT'}</span>
                <span className="font-bold text-purple-700">{formatEuro(commissionHT)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100 bg-blue-50">
                <span className="text-gray-900 font-medium">{isSpain ? `Tu palier de ${pallier}%` : `Ton pallier de ${pallier}%`}</span>
                <span className="font-bold text-blue-700">{netAvecPallier.toLocaleString()} €</span>
              </div>
              <p className="text-xs text-gray-500 italic">{isSpain ? '(Este es el importe que tú encajas, sobre el que se aplican cargas e impuestos)' : "(C'est ce montant que tu touches, sur lequel s'appliquent charges et impôts)"}</p>
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-600">{isSpain ? `Cargas AE (~${Math.round(CHARGES_AE * 100)}%)` : `Charges AE (~${Math.round(CHARGES_AE * 100)}%)`}</span>
                <span className="font-medium text-red-600">-{formatEuro(chargesSociales)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-600">{isSpain ? `Impuesto liberatorio (${impotPourcent}%)` : `Impôt libératoire (${impotPourcent}%)`}</span>
                <span className="font-medium text-indigo-600">-{formatEuro(impotLiberatoire)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-600">{isSpain ? 'Colaborador + Gastos' : 'Apporteur + Frais'}</span>
                <span className="font-medium text-orange-600">-{formatEuro(apporteurMontant + fraisNotaire)}</span>
              </div>
            </div>

            {/* Net final */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
              <p className="text-sm text-blue-700">{isSpain ? '<strong>NET FINAL</strong> en tu bolsillo :' : '<strong>NET FINAL</strong> dans ta poche :'}</p>
              <p className="text-3xl font-bold text-blue-800 mt-1">{formatEuro(netFinal)}</p>
            </div>
          </div>

          {/* Sauvegarder */}
          <div className="flex gap-3">
            <Input
              value={nomVente}
              onChange={e => setNomVente(e.target.value)}
              placeholder={isSpain ? 'Nombre de la venta (ej: Casa Barcelona)' : 'Nom de la vente (ex: Maison Perpignan)'}
              className="flex-1"
            />
            <Button onClick={saveSimulation} disabled={!nomVente.trim()} className="bg-red-600 hover:bg-red-700">
              <Save className="w-4 h-4 mr-2" /> {isSpain ? 'Guardar' : 'Enregistrer'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Simulations enregistrées */}
      {simulations.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" /> {isSpain ? 'Ventas guardadas' : 'Ventes enregistrées'}
          </h3>
          <div className="space-y-3">
            {simulations.map(sim => {
              const ch = Math.round(sim.commissionHT * CHARGES_AE);
              const imp = Math.round(sim.commissionHT * (sim.impotPourcent / 100));
              const net = sim.commissionHT - ch - imp - sim.apporteur;
              const netPallier = Math.round(net * (sim.pallier / 100));
              return (
                <Card key={sim.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{sim.nomVente}</p>
                        <p className="text-sm text-gray-500">
                          {formatEuro(sim.prixVente)} · {sim.tauxCommission}% · HT {formatEuro(sim.commissionHT)} · Palier {sim.pallier}%
                        </p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="text-xs text-gray-400">{isSpain ? 'Net conservado' : 'Net conservé'}</p>
                        <p className="text-lg font-bold text-green-700">{formatEuro(netPallier)}</p>
                      </div>
                      <button onClick={() => removeSimulation(sim.id)} className="text-gray-400 hover:text-red-500 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-gray-400 text-center">
        {isSpain
          ? 'Cálculo basado en régimen de autónomo. Cargas sociales estimadas al ~12.8%. El impuesto liberatorio depende de tu elección personal.'
          : 'Calcul basé sur le régime auto-entrepreneur. Charges sociales estimées à ~12.8%. L\'impôt libératoire dépend de ton choix personnel.'}
      </p>
    </div>
  );
}
