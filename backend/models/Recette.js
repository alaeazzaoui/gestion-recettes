const mongoose = require('mongoose');

const recetteSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la recette est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  
  tempsPreparation: {
    type: Number,
    required: [true, 'Le temps de préparation est requis'],
    min: [0, 'Le temps de préparation doit être positif']
  },
  
  tempsCuisson: {
    type: Number,
    required: [true, 'Le temps de cuisson est requis'],
    min: [0, 'Le temps de cuisson doit être positif']
  },
  
  niveauDifficulte: {
    type: String,
    required: [true, 'Le niveau de difficulté est requis'],
    enum: {
      values: ['facile', 'moyen', 'difficile'],
      message: '{VALUE} n\'est pas un niveau de difficulté valide'
    },
    lowercase: true
  },
  
  nbrPortions: {
    type: Number,
    required: [true, 'Le nombre de portions est requis'],
    min: [1, 'Le nombre de portions doit être au moins 1']
  },
  
  photoURL: {
    type: String,
    required: [true, 'L\'URL de la photo est requise'],
    trim: true
  },
  
  datePublication: {
    type: Date,
    default: Date.now
  },
  
  // Référence vers la collection Categorie
  categorieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorie',
    required: [true, 'La catégorie est requise']
  },
  
  // Référence vers la collection Regime
  regimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Regime',
    required: [true, 'Le régime est requis']
  },
  
  // Tableau d'étapes
  etapes: [{
    ordre: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
  }],
  
  // Tableau d'ingrédients
  ingredients: [{
    nom: {
      type: String,
      required: true,
      trim: true
    },
    quantite: {
      type: Number,
      required: true,
      min: 0
    },
    unite: {
      type: String,
      required: true,
      enum: ['g', 'kg', 'ml', 'l', 'cuillère à soupe', 'cuillère à café', 'tasse', 'pincée', 'unité'],
      trim: true
    }
  }],
  
  // Tableau de notations
  notations: [{
    utilisateurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur',
      required: true
    },
    note: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    commentaire: {
      type: String,
      trim: true,
      maxlength: 500
    },
    dateNotation: {
      type: Date,
      default: Date.now
    }
  }]
  
}, {
  timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual pour calculer la note moyenne
recetteSchema.virtual('noteMoyenne').get(function() {
  if (this.notations.length === 0) return 0;
  const somme = this.notations.reduce((acc, notation) => acc + notation.note, 0);
  return (somme / this.notations.length).toFixed(1);
});

// Virtual pour calculer le temps total
recetteSchema.virtual('tempsTotal').get(function() {
  return this.tempsPreparation + this.tempsCuisson;
});

// Middleware pre-save pour trier les étapes
recetteSchema.pre('save', function(next) {
  if (this.etapes && this.etapes.length > 0) {
    this.etapes.sort((a, b) => a.ordre - b.ordre);
  }
  next();
});

const Recette = mongoose.model('Recette', recetteSchema);

module.exports = Recette;