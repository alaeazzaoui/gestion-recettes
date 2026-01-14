const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la catégorie est requis'],
    trim: true,
    unique: true
  }
}, {
  timestamps: true
});

// Index pour recherche rapide
categorieSchema.index({ nom: 1 });

const Categorie = mongoose.model('Categorie', categorieSchema);

module.exports = Categorie;