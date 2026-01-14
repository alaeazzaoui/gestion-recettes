const mongoose = require('mongoose');

const elementRecetteSchema = new mongoose.Schema({
  recetteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recette',
    required: true
  },
  ingredientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true
  },
  quantite: {
    type: Number,
    required: true
  },
  unite: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'elementsRecette'
});

// Index pour améliorer les performances
elementRecetteSchema.index({ recetteId: 1 });
elementRecetteSchema.index({ ingredientId: 1 });

const ElementRecette = mongoose.model('ElementRecette', elementRecetteSchema);

module.exports = ElementRecette;