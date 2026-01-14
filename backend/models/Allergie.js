const mongoose = require('mongoose');

const allergieSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'allergies'
});

const Allergie = mongoose.model('Allergie', allergieSchema);

module.exports = Allergie;