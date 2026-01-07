const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Entrée', 'Plat', 'Dessert', 'Boisson', 'Apéritif', 'Autre']
  },
  ingredients: [{
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    unit: { type: String }
  }],
  steps: [{
    order: { type: Number, required: true },
    description: { type: String, required: true }
  }],
  prepTime: {
    type: Number,
    required: true // en minutes
  },
  cookTime: {
    type: Number,
    required: true // en minutes
  },
  servings: {
    type: Number,
    required: true,
    default: 4
  },
  difficulty: {
    type: String,
    enum: ['Facile', 'Moyen', 'Difficile'],
    default: 'Moyen'
  },
  image: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index pour la recherche
recipeSchema.index({ title: 'text', 'ingredients.name': 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);