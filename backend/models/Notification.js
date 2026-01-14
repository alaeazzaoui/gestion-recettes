const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  titre: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  lue: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'notifications'
});

// Index pour récupérer les notifications d'un client
notificationSchema.index({ clientId: 1, lue: 1 });
notificationSchema.index({ clientId: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;