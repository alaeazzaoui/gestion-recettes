const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  
  prenom: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide']
  },
  
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false
  },
  
  dateInscription: {
    type: Date,
    default: Date.now
  }
  
}, {
  timestamps: true
});

// Index pour recherche rapide
utilisateurSchema.index({ email: 1 });

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

module.exports = Utilisateur;