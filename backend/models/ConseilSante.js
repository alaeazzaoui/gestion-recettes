const mongoose = require('mongoose');

const conseilSanteSchema = new mongoose.Schema({
  contenu: {
    type: String,
    required: true,
    trim: true
  },
  texte: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'conseilsSante'
});

const ConseilSante = mongoose.model('ConseilSante', conseilSanteSchema);

module.exports = ConseilSante;