const mongoose = require('mongoose');

const etapeSchema = new mongoose.Schema({
  recetteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recette',
    required: true
  },
  numero: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  duree: {
    type: Number,
    required: false
  }
}, {
  timestamps: true,
  collection: 'etapes'
});

// Index pour améliorer les performances de recherche par recette
etapeSchema.index({ recetteId: 1, numero: 1 });

const Etape = mongoose.model('Etape', etapeSchema);

module.exports = Etape;