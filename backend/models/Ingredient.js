const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  famille: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'ingredients'
});

// Index pour rechercher par famille
ingredientSchema.index({ famille: 1 });

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;