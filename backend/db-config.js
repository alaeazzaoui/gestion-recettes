// ============================================
// Configuration de connexion MongoDB - Node.js
// ============================================

const mongoose = require('mongoose');
require('dotenv').config(); 

// Pour MongoDB local
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recettes_db';

// Connexion avec Mongoose
async function connectMongoose() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connexion MongoDB réussie avec Mongoose');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
}

// Gestion des événements de connexion
mongoose.connection.on('connected', () => {
  console.log('Mongoose connecté à MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Erreur de connexion Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose déconnecté de MongoDB');
});

// Fermeture propre de la connexion
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Connexion MongoDB fermée');
  process.exit(0);
});

// IMPORTANT : Exporter la fonction
module.exports = connectMongoose;