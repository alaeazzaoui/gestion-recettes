const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  dateExpiration: {
    type: Date,
    required: true
  },
  actif: {
    type: Boolean,
    default: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'sessions'
});

// Index pour rechercher par token
sessionSchema.index({ token: 1 });
// Index pour rechercher les sessions actives d'un client
sessionSchema.index({ clientId: 1, actif: 1 });
// Index TTL pour supprimer automatiquement les sessions expirées
sessionSchema.index({ dateExpiration: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;