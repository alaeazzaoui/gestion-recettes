const mongoose = require('mongoose');
const Utilisateur = require('./Utilisateur');

// Client hérite d'Utilisateur
const clientSchema = new mongoose.Schema({
  skinaObjectId: {
    type: String,
    required: [true, 'Le skinaObjectId est requis'],
    trim: true
  },
  
  tel: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    trim: true
  },
  
  allergieIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Allergie'
  }],
  
  favoris: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recette'
  }],
  
  listesCourse: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ListeCourse'
  }],
  
  sessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  }],
  
  notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }]
});

// Index pour recherche rapide
clientSchema.index({ skinaObjectId: 1 });
clientSchema.index({ tel: 1 });

// Créer le discriminator
const Client = Utilisateur.discriminator('Client', clientSchema);

module.exports = Client;