// Prix moyens estimés (€) par ville et type de secteur
// Sources: meilleursagents, seLoger, données 2025-2026
// Les prix sont indicatifs pour guider le conseiller débutant

export interface CityPrice {
  city: string;
  center: number;
  periphery: number;
  rural: number;
  luxe: number;
}

const cityPrices: Record<string, CityPrice> = {
  // Grandes métropoles
  paris: { city: 'Paris', center: 10200, periphery: 7500, rural: 0, luxe: 18500 },
  lyon: { city: 'Lyon', center: 5600, periphery: 3800, rural: 2800, luxe: 9500 },
  marseille: { city: 'Marseille', center: 4200, periphery: 3200, rural: 2400, luxe: 7800 },
  bordeaux: { city: 'Bordeaux', center: 5800, periphery: 3800, rural: 2800, luxe: 9200 },
  toulouse: { city: 'Toulouse', center: 4200, periphery: 3100, rural: 2300, luxe: 7200 },
  nantes: { city: 'Nantes', center: 4400, periphery: 3200, rural: 2400, luxe: 7500 },
  strasbourg: { city: 'Strasbourg', center: 3800, periphery: 2800, rural: 2100, luxe: 6500 },
  montpellier: { city: 'Montpellier', center: 4200, periphery: 3100, rural: 2400, luxe: 7200 },
  lille: { city: 'Lille', center: 3800, periphery: 2800, rural: 2100, luxe: 6200 },
  nice: { city: 'Nice', center: 5500, periphery: 4200, rural: 3200, luxe: 11500 },
  rennes: { city: 'Rennes', center: 4200, periphery: 3100, rural: 2400, luxe: 6800 },

  // Villes moyennes
  grenoble: { city: 'Grenoble', center: 3400, periphery: 2600, rural: 1900, luxe: 5800 },
  rouen: { city: 'Rouen', center: 2800, periphery: 2200, rural: 1700, luxe: 4800 },
  toulon: { city: 'Toulon', center: 3600, periphery: 2800, rural: 2100, luxe: 6200 },
  dijon: { city: 'Dijon', center: 2600, periphery: 2000, rural: 1600, luxe: 4500 },
  angers: { city: 'Angers', center: 2800, periphery: 2100, rural: 1700, luxe: 4800 },
  villeurbanne: { city: 'Villeurbanne', center: 4200, periphery: 3200, rural: 0, luxe: 0 },
  saintetienne: { city: 'Saint-Étienne', center: 1500, periphery: 1300, rural: 1100, luxe: 2800 },
  lehavre: { city: 'Le Havre', center: 2400, periphery: 1900, rural: 1500, luxe: 4200 },
  reims: { city: 'Reims', center: 2600, periphery: 2000, rural: 1600, luxe: 4500 },
  perpignan: { city: 'Perpignan', center: 2100, periphery: 1700, rural: 1500, luxe: 3800 },
  avignon: { city: 'Avignon', center: 2600, periphery: 2000, rural: 1700, luxe: 4800 },
  besancon: { city: 'Besançon', center: 2200, periphery: 1800, rural: 1500, luxe: 3800 },
  nimes: { city: 'Nîmes', center: 2800, periphery: 2100, rural: 1700, luxe: 4800 },
  metz: { city: 'Metz', center: 2400, periphery: 1900, rural: 1500, luxe: 4200 },
  tours: { city: 'Tours', center: 2800, periphery: 2100, rural: 1700, luxe: 4800 },
  orleans: { city: 'Orléans', center: 2600, periphery: 2000, rural: 1600, luxe: 4500 },
  mulhouse: { city: 'Mulhouse', center: 2000, periphery: 1600, rural: 1400, luxe: 3500 },
  caen: { city: 'Caen', center: 2800, periphery: 2100, rural: 1700, luxe: 4800 },
  brest: { city: 'Brest', center: 2400, periphery: 1900, rural: 1600, luxe: 4200 },
  limoges: { city: 'Limoges', center: 1700, periphery: 1400, rural: 1200, luxe: 3000 },
  clermontferrand: { city: 'Clermont-Ferrand', center: 2400, periphery: 1900, rural: 1600, luxe: 4200 },
  troyes: { city: 'Troyes', center: 1900, periphery: 1600, rural: 1300, luxe: 3200 },
  poitiers: { city: 'Poitiers', center: 2000, periphery: 1600, rural: 1400, luxe: 3500 },
  annecy: { city: 'Annecy', center: 6200, periphery: 4500, rural: 3500, luxe: 10500 },
  biarritz: { city: 'Biarritz', center: 6800, periphery: 4800, rural: 3500, luxe: 12500 },
  cannes: { city: 'Cannes', center: 6500, periphery: 4800, rural: 0, luxe: 14500 },
  aixenprovence: { city: 'Aix-en-Provence', center: 5200, periphery: 3800, rural: 2800, luxe: 9200 },
  chambery: { city: 'Chambéry', center: 3800, periphery: 2800, rural: 2200, luxe: 6500 },
  lausanne: { city: 'Lausanne', center: 13500, periphery: 9800, rural: 0, luxe: 22000 },
  geneve: { city: 'Genève', center: 15800, periphery: 11200, rural: 0, luxe: 28000 },
  bayonne: { city: 'Bayonne', center: 4200, periphery: 3200, rural: 2500, luxe: 7200 },
  antibes: { city: 'Antibes', center: 5800, periphery: 4200, rural: 0, luxe: 11500 },
  lorient: { city: 'Lorient', center: 2200, periphery: 1800, rural: 1500, luxe: 3800 },
  pau: { city: 'Pau', center: 2100, periphery: 1700, rural: 1400, luxe: 3800 },
  valence: { city: 'Valence', center: 2200, periphery: 1800, rural: 1500, luxe: 3800 },
  bourgenbresse: { city: 'Bourg-en-Bresse', center: 2000, periphery: 1600, rural: 1400, luxe: 3500 },
  beziers: { city: 'Béziers', center: 1800, periphery: 1500, rural: 1300, luxe: 3200 },
  sete: { city: 'Sète', center: 3200, periphery: 2500, rural: 0, luxe: 5800 },
  colmar: { city: 'Colmar', center: 2800, periphery: 2200, rural: 1800, luxe: 4800 },
  saintmalo: { city: 'Saint-Malo', center: 4800, periphery: 3500, rural: 0, luxe: 8500 },
  quimper: { city: 'Quimper', center: 2000, periphery: 1600, rural: 1400, luxe: 3500 },

  // === VILLES ESPAGNOLES ===
  // Grandes métropoles
  madrid: { city: 'Madrid', center: 5200, periphery: 3600, rural: 0, luxe: 12000 },
  barcelona: { city: 'Barcelona', center: 4800, periphery: 3200, rural: 0, luxe: 11500 },
  valencia: { city: 'Valencia', center: 2800, periphery: 2100, rural: 1500, luxe: 6500 },
  sevilla: { city: 'Sevilla', center: 2600, periphery: 1900, rural: 1400, luxe: 5800 },
  malaga: { city: 'Málaga', center: 3400, periphery: 2500, rural: 1600, luxe: 8500 },
  zaragoza: { city: 'Zaragoza', center: 2200, periphery: 1700, rural: 1300, luxe: 4500 },
  palma: { city: 'Palma de Mallorca', center: 4800, periphery: 3500, rural: 0, luxe: 12500 },
  laspalmas: { city: 'Las Palmas de Gran Canaria', center: 2600, periphery: 2000, rural: 0, luxe: 5500 },
  alicante: { city: 'Alicante', center: 2200, periphery: 1700, rural: 1400, luxe: 5200 },
  cordoba: { city: 'Córdoba', center: 2000, periphery: 1600, rural: 1200, luxe: 4200 },
  valladolid: { city: 'Valladolid', center: 1800, periphery: 1400, rural: 1100, luxe: 3800 },
  vigo: { city: 'Vigo', center: 1900, periphery: 1500, rural: 1200, luxe: 4000 },
  gijon: { city: 'Gijón', center: 2000, periphery: 1600, rural: 1300, luxe: 4200 },
  hospitalet: { city: "L'Hospitalet de Llobregat", center: 3200, periphery: 0, rural: 0, luxe: 0 },
  vitoriagasteiz: { city: 'Vitoria-Gasteiz', center: 2400, periphery: 1900, rural: 1400, luxe: 4800 },
  laceruna: { city: 'La Coruña', center: 2200, periphery: 1700, rural: 0, luxe: 4800 },
  // Villes moyennes espagnoles
  granada: { city: 'Granada', center: 2400, periphery: 1800, rural: 1400, luxe: 5200 },
  santacruzdetenerife: { city: 'Santa Cruz de Tenerife', center: 2100, periphery: 1600, rural: 0, luxe: 4800 },
  badajoz: { city: 'Badajoz', center: 1300, periphery: 1100, rural: 900, luxe: 2800 },
  oviedo: { city: 'Oviedo', center: 2200, periphery: 1700, rural: 1300, luxe: 4500 },
  pamplona: { city: 'Pamplona', center: 3100, periphery: 2300, rural: 1700, luxe: 5800 },
  sabadell: { city: 'Sabadell', center: 2600, periphery: 2000, rural: 0, luxe: 0 },
  terrassa: { city: 'Terrassa', center: 2400, periphery: 1900, rural: 0, luxe: 0 },
  murcia: { city: 'Murcia', center: 1600, periphery: 1300, rural: 1000, luxe: 3500 },
  santander: { city: 'Santander', center: 2800, periphery: 2200, rural: 1600, luxe: 6200 },
  burgos: { city: 'Burgos', center: 1700, periphery: 1400, rural: 1100, luxe: 3200 },
  almeria: { city: 'Almería', center: 1800, periphery: 1400, rural: 1100, luxe: 3800 },
  salamanca: { city: 'Salamanca', center: 2100, periphery: 1600, rural: 1300, luxe: 4200 },
  leon: { city: 'León', center: 1400, periphery: 1200, rural: 1000, luxe: 2800 },
  castellon: { city: 'Castellón de la Plana', center: 1700, periphery: 1400, rural: 1100, luxe: 3500 },
  sansebastian: { city: 'San Sebastián', center: 6200, periphery: 4500, rural: 0, luxe: 13500 },
  bilbao: { city: 'Bilbao', center: 4200, periphery: 3100, rural: 0, luxe: 9500 },
  ibiza: { city: 'Ibiza', center: 7200, periphery: 5500, rural: 0, luxe: 18500 },
  marbella: { city: 'Marbella', center: 4500, periphery: 3200, rural: 0, luxe: 12500 },
};

// Estimation par défaut quand la ville n'est pas dans la base
function getDefaultPrice(city: string): CityPrice {
  // Estimation basée sur la longueur du nom... ou plutôt un algorithme simple
  // Petit jeu : on essaie de détecter si c'est une grosse ville ou non
  const lowerCity = city.toLowerCase().trim();
  
  // Détection heuristique basée sur la ville
  const bigCities = ['villeurbanne', 'montreuil', 'argenteuil', 'aubervilliers', 'nanterre'];
  const mediumCities = ['calais', 'dunkerque', 'amiens', 'le mans', 'ajaccio', 'bastia'];
  
  if (bigCities.includes(lowerCity)) {
    return { city, center: 4200, periphery: 3100, rural: 0, luxe: 6800 };
  }
  if (mediumCities.includes(lowerCity)) {
    return { city, center: 2100, periphery: 1700, rural: 1400, luxe: 3800 };
  }
  
  // Par défaut : petite ville moyenne
  return { city, center: 2200, periphery: 1800, rural: 1500, luxe: 4000 };
}

// Estimation par défaut pour l'Espagne
function getDefaultPriceSpain(city: string): CityPrice {
  const lowerCity = city.toLowerCase().trim();
  
  // Détection heuristique pour les grandes villes espagnoles
  const bigCitiesSpain = ['elche', 'tarragona', 'cordoue', 'toledo', 'gérone', 'badalone', 'sabadell'];
  const touristCities = ['benidorm', 'salou', 'sitges', 'lloret', ' Roses', 'denia', 'javea', 'calpe'];
  
  if (bigCitiesSpain.includes(lowerCity)) {
    return { city, center: 2000, periphery: 1600, rural: 0, luxe: 4500 };
  }
  if (touristCities.includes(lowerCity)) {
    return { city, center: 2800, periphery: 2200, rural: 0, luxe: 6500 };
  }
  
  // Par défaut : ville espagnole moyenne
  return { city, center: 1600, periphery: 1300, rural: 1000, luxe: 3500 };
}

function normalizeCityName(city: string): string {
  return city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[-\s']/g, '') // Remove hyphens, spaces, apostrophes
    .trim();
}

export function getCityPrice(city: string, sectorType: 'centre-ville' | 'peripherie' | 'rural' | 'luxe', country: 'france' | 'spain' = 'france'): number {
  const normalized = normalizeCityName(city);
  const data = cityPrices[normalized] || (country === 'spain' ? getDefaultPriceSpain(city) : getDefaultPrice(city));
  
  switch (sectorType) {
    case 'centre-ville': return data.center;
    case 'peripherie': return data.periphery;
    case 'rural': return data.rural;
    case 'luxe': return data.luxe;
    default: return data.center;
  }
}

export function getPriceLabel(sectorType: string, lang: 'fr' | 'es' = 'fr'): string {
  if (lang === 'es') {
    switch (sectorType) {
      case 'centre-ville': return 'Centro-ciudad';
      case 'peripherie': return 'Periferia';
      case 'rural': return 'Rural';
      case 'luxe': return 'Lujo / Premium';
      default: return sectorType;
    }
  }
  switch (sectorType) {
    case 'centre-ville': return 'Centre-ville';
    case 'peripherie': return 'Périphérie';
    case 'rural': return 'Rural';
    case 'luxe': return 'Luxe / Premium';
    default: return sectorType;
  }
}

export function getSuggestedPriceText(city: string, sectorType: 'centre-ville' | 'peripherie' | 'rural' | 'luxe', country: 'france' | 'spain' = 'france', lang: 'fr' | 'es' = 'fr'): string {
  const price = getCityPrice(city, sectorType, country);
  const pricePerM2 = Math.round(price / 100) * 100; // Round to nearest 100
  const avgApartmentSize = 75; // m² average apartment
  const estimatedAvg = pricePerM2 * avgApartmentSize;
  
  if (lang === 'es') {
    return `En ${city} (${getPriceLabel(sectorType, 'es')}), el precio medio es de unos ${(pricePerM2).toLocaleString()}€/m². Para un apartamento medio de ${avgApartmentSize}m², eso da unos ${estimatedAvg.toLocaleString()}€. Puedes ajustar según el tipo de bien principal que vayas a vender (estudio, casa, villa...).`;
  }
  return `Sur ${city} (${getPriceLabel(sectorType)}), le prix moyen est d'environ ${(pricePerM2).toLocaleString()}€/m². Pour un appartement moyen de ${avgApartmentSize}m², ça donne environ ${estimatedAvg.toLocaleString()}€. Tu peux ajuster selon le type de bien principal que tu vas vendre (studio, maison, villa...).`;
}
