const mongoose = require('mongoose');

const regimeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du régime est requis'],
    trim: true,
    unique: true
  }
}, {
  timestamps: true
});

// Index pour recherche rapide
regimeSchema.index({ nom: 1 });

const Regime = mongoose.model('Regime', regimeSchema);

module.exports = Regime;