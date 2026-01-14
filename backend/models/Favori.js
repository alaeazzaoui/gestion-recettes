const mongoose = require('mongoose');

const favoriSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  recetteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recette',
    required: true
  }
}, {
  timestamps: true,
  collection: 'favoris'
});

// Index unique pour éviter les doublons (un client ne peut ajouter la même recette qu'une fois)
favoriSchema.index({ clientId: 1, recetteId: 1 }, { unique: true });

const Favori = mongoose.model('Favori', favoriSchema);

module.exports = Favori;