const mongoose = require('mongoose');

const notationSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  recetteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recette',
    required: true
  },
  note: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  commentaire: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'notations'
});

// Index unique pour qu'un client ne puisse noter qu'une fois la même recette
notationSchema.index({ clientId: 1, recetteId: 1 }, { unique: true });
// Index pour calculer la moyenne des notes par recette
notationSchema.index({ recetteId: 1 });

const Notation = mongoose.model('Notation', notationSchema);

module.exports = Notation;