const Session = require('../models/Session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Logic à implémenter selon votre modèle Client/Utilisateur
    // Vérifier email/password, générer token JWT, créer session
    res.json({ message: 'À implémenter selon votre logique d\'authentification' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { token } = req.body;
    await Session.findOneAndUpdate({ token }, { actif: false });
    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verify = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const session = await Session.findOne({ token, actif: true }).populate('clientId');
    if (!session || session.dateExpiration < new Date()) {
      return res.status(401).json({ message: 'Session invalide ou expirée' });
    }
    res.json({ valid: true, user: session.clientId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByClient = async (req, res) => {
  try {
    const sessions = await Session.find({ clientId: req.params.clientId });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session non trouvée' });
    res.json({ message: 'Session supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};