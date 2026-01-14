const mongoose = require('mongoose');

const listeCourseSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  ingredientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true
  },
  quantite: {
    type: Number,
    required: true
  },
  unite: {
    type: String,
    required: true,
    trim: true
  },
  achete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'listesCourse'
});

// Index pour récupérer la liste d'un client
listeCourseSchema.index({ clientId: 1 });
listeCourseSchema.index({ clientId: 1, achete: 1 });

const ListeCourse = mongoose.model('ListeCourse', listeCourseSchema);

module.exports = ListeCourse;