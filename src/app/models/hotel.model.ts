// ===============================
// MODELS POUR LE SYSTÈME HÔTELIER
// ===============================

export interface Hotel {
  id?: number;
  nom: string;
  adresse: string;
  ville: string;
  pays: string;
  codePostal?: string;
  telephone: string;
  email: string;
  siteWeb?: string;
  nombreEtoiles?: number;
  description?: string;
  equipements?: string[];
  imagePrincipale?: string;
  imagesSecondaires?: string[];
  capaciteTotale?: number;
  nombreChambres?: number;
  disponible?: boolean;
  taxNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Chambre {
  id?: number;
  hotel: number;
  hotel_nom?: string;
  numero: string;
  type_chambre: TypeChambre;
  etage: number;
  capacite_adultes: number;
  capacite_enfants: number;
  superficie?: number;
  prix_nuit: number;
  description?: string;
  equipements?: string[];
  image_principale?: string;
  images_secondaires?: string[];
  disponible: boolean;
  etat?: StatutChambre;
  notes?: string;
  date_creation?: string;
  date_modification?: string;
}

export enum TypeChambre {
  SIMPLE = 'SIMPLE',
  DOUBLE = 'DOUBLE',
  TWIN = 'TWIN',
  TRIPLE = 'TRIPLE',
  SUITE = 'SUITE',
  SUITE_JUNIOR = 'SUITE_JUNIOR',
  SUITE_EXECUTIVE = 'SUITE_EXECUTIVE',
  SUITE_PRESIDENTIELLE = 'SUITE_PRESIDENTIELLE',
  FAMILIALE = 'FAMILIALE',
  STUDIO = 'STUDIO',
  APPARTEMENT = 'APPARTEMENT'
}

export enum StatutChambre {
  DISPONIBLE = 'DISPONIBLE',
  OCCUPEE = 'OCCUPEE',
  MENAGE_EN_COURS = 'MENAGE_EN_COURS',
  MAINTENANCE = 'MAINTENANCE',
  HORS_SERVICE = 'HORS_SERVICE',
  RESERVEE = 'RESERVEE'
}

export interface ChambreFilter {
  hotel?: number;
  type_chambre?: string;
  etage?: number;
  capacite_adultes?: number;
  prix_min?: number;
  prix_max?: number;
  disponible?: boolean;
  etat?: StatutChambre;
  date_debut?: Date;
  date_fin?: Date;
  equipements?: string[];
}

export interface HotelFilter {
  ville?: string;
  pays?: string;
  nombre_etoiles?: number;
  prix_min?: number;
  prix_max?: number;
  capacite_min?: number;
  disponible?: boolean;
  equipements?: string[];
}

// Labels pour les types de chambres
export const TYPE_CHAMBRE_LABELS: Record<TypeChambre, string> = {
  [TypeChambre.SIMPLE]: 'Chambre Simple',
  [TypeChambre.DOUBLE]: 'Chambre Double',
  [TypeChambre.TWIN]: 'Chambre Twin',
  [TypeChambre.TRIPLE]: 'Chambre Triple',
  [TypeChambre.SUITE]: 'Suite',
  [TypeChambre.SUITE_JUNIOR]: 'Suite Junior',
  [TypeChambre.SUITE_EXECUTIVE]: 'Suite Executive',
  [TypeChambre.SUITE_PRESIDENTIELLE]: 'Suite Présidentielle',
  [TypeChambre.FAMILIALE]: 'Chambre Familiale',
  [TypeChambre.STUDIO]: 'Studio',
  [TypeChambre.APPARTEMENT]: 'Appartement'
};

// Labels pour les statuts de chambres
export const STATUT_CHAMBRE_LABELS: Record<StatutChambre, string> = {
  [StatutChambre.DISPONIBLE]: 'Disponible',
  [StatutChambre.OCCUPEE]: 'Occupée',
  [StatutChambre.MENAGE_EN_COURS]: 'Ménage en cours',
  [StatutChambre.MAINTENANCE]: 'Maintenance',
  [StatutChambre.HORS_SERVICE]: 'Hors service',
  [StatutChambre.RESERVEE]: 'Réservée'
};

// Couleurs pour les statuts
export const STATUT_CHAMBRE_COLORS: Record<StatutChambre, string> = {
  [StatutChambre.DISPONIBLE]: 'success',
  [StatutChambre.OCCUPEE]: 'danger',
  [StatutChambre.MENAGE_EN_COURS]: 'warning',
  [StatutChambre.MAINTENANCE]: 'info',
  [StatutChambre.HORS_SERVICE]: 'secondary',
  [StatutChambre.RESERVEE]: 'primary'
};

// Équipements disponibles
export const EQUIPEMENTS_CHAMBRE = [
  'WiFi',
  'Climatisation',
  'Télévision',
  'Minibar',
  'Coffre-fort',
  'Bureau',
  'Balcon',
  'Vue mer',
  'Vue montagne',
  'Salle de bain privée',
  'Baignoire',
  'Douche',
  'Sèche-cheveux',
  'Peignoir',
  'Chaussons',
  'Kit de toilette',
  'Téléphone',
  'Service en chambre',
  'Fer à repasser',
  'Machine à café',
  'Bouilloire',
  'Réfrigérateur',
  'Four micro-ondes',
  'Kitchenette',
  'Insonorisation',
  'Fenêtres anti-bruit',
  'Lit King Size',
  'Lit Queen Size',
  'Canapé-lit',
  'Lit bébé (sur demande)',
  'Chaise haute (sur demande)'
];

// Équipements de l'hôtel
export const EQUIPEMENTS_HOTEL = [
  'Restaurant',
  'Bar',
  'Piscine',
  'Spa',
  'Salle de sport',
  'Parking',
  'WiFi gratuit',
  'Réception 24h/24',
  'Service de conciergerie',
  'Navette aéroport',
  'Location de voitures',
  'Service de blanchisserie',
  'Salle de réunion',
  'Centre d\'affaires',
  'Jardin',
  'Terrasse',
  'Ascenseur',
  'Accès handicapés',
  'Coffre-fort à la réception',
  'Consigne à bagages',
  'Service d\'étage',
  'Room service 24h/24',
  'Petit-déjeuner buffet',
  'Animaux acceptés',
  'Garde d\'enfants',
  'Aire de jeux pour enfants',
  'Club enfants',
  'Piscine pour enfants',
  'Casino',
  'Discothèque',
  'Boutiques',
  'Salon de coiffure',
  'Hammam',
  'Sauna',
  'Jacuzzi',
  'Massage',
  'Terrain de tennis',
  'Terrain de golf',
  'Plage privée',
  'Sports nautiques'
];
