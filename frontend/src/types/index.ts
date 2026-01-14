export interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  dateInscription: Date;
  __t?: string;
}

export interface Client extends User {
  skinaObjectId: string;
  tel: string;
  allergieIds: string[];
  favoris: string[];
}

export interface Admin extends User {
  niveauAcces: 'admin' | 'super_admin';
}

export interface Categorie {
  _id: string;
  nom: string;
}

export interface Recette {
  _id: string;
  titre: string;
  description: string;
  tempsPreparation: number;
  tempsCuisson: number;
  nombrePersonnes: number;
  difficulte: 'facile' | 'moyen' | 'difficile';
  categorieId: string;
  imageUrl?: string;
}

export interface AuthResponse {
  token: string;
  utilisateur: User;
}