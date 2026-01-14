const mongoose = require('mongoose');
const Utilisateur = require('./Utilisateur');

// Admin hérite d'Utilisateur
const adminSchema = new mongoose.Schema({
  niveauAcces: {
    type: String,
    required: [true, 'Le niveau d\'accès est requis'],
    enum: ['admin', 'super_admin'],
    default: 'admin'
  }
});

// Index pour recherche rapide
adminSchema.index({ niveauAcces: 1 });

// Créer le discriminator
const Admin = Utilisateur.discriminator('Admin', adminSchema);

module.exports = Admin;