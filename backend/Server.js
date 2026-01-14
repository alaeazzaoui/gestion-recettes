// ============================================
// Serveur Principal avec Redis
// ============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Connexions aux bases de données
const mongoose = require('mongoose');
const redisConnection = require('./redis-config');

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger basique
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================

// Route de santé
app.get('/health', async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const redisStatus = redisConnection.isConnected() ? 'connected' : 'disconnected';
  
  res.json({
    status: 'ok',
    mongodb: mongoStatus,
    redis: redisStatus,
    timestamp: new Date().toISOString()
  });
});

// Routes API
// Importez et utilisez vos routes ici
// const recipeRoutes = require('./routes/recipeRoutes');
// app.use('/api/recipes', recipeRoutes);

// ============================================
// CONNEXION AUX BASES DE DONNÉES
// ============================================

const connectDatabases = async () => {
  try {
    // Connexion MongoDB
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion-recettes', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connecté avec succès');

    // Connexion Redis
    console.log('🔄 Connexion à Redis...');
    await redisConnection.connect();
    console.log('✅ Redis connecté avec succès');

    // Test de ping Redis
    const pingResult = await redisConnection.ping();
    if (pingResult) {
      console.log('✅ Redis répond correctement (PONG)');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la connexion aux bases de données:', error);
    process.exit(1);
  }
};

// ============================================
// GESTION DES ERREURS
// ============================================

// 404 - Route non trouvée
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connecter aux bases de données
    await connectDatabases();

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log('');
      console.log('========================================');
      console.log(`🚀 Serveur lancé sur le port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log('========================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// ============================================
// GESTION DE L'ARRÊT PROPRE
// ============================================

const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️ ${signal} reçu. Arrêt propre en cours...`);
  
  try {
    // Fermer la connexion Redis
    await redisConnection.disconnect();
    console.log('✅ Redis déconnecté');

    // Fermer la connexion MongoDB
    await mongoose.connection.close();
    console.log('✅ MongoDB déconnecté');

    console.log('✅ Arrêt propre terminé');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'arrêt:', error);
    process.exit(1);
  }
};

// Écouter les signaux d'arrêt
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Gérer les erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Rejet de promesse non géré:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exception non capturée:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Démarrer le serveur
startServer();

module.exports = app;