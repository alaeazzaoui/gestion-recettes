const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// Import des routes
const routes = require('./routes');

// Routes principales
app.use("/api", routes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Gestion des Recettes' });
});

// Gestion des erreurs 404
const { notFound, errorHandler } = require('./middleware/errorHandler');
app.use(notFound);

// Gestion globale des erreurs
app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});