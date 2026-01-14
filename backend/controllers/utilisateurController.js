const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, nom } = req.body;
    
    const existingUser = await Utilisateur.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const utilisateur = new Utilisateur({ email, password: hashedPassword, nom });
    await utilisateur.save();
    
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    
    const isValid = await bcrypt.compare(password, utilisateur.password);
    if (!isValid) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    
    const token = jwt.sign({ id: utilisateur._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, utilisateur: { id: utilisateur._id, email, nom: utilisateur.nom } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.user.id).select('-password');
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(utilisateur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const utilisateur = await Utilisateur.findById(req.user.id);
    
    const isValid = await bcrypt.compare(oldPassword, utilisateur.password);
    if (!isValid) return res.status(400).json({ message: 'Ancien mot de passe incorrect' });
    
    utilisateur.password = await bcrypt.hash(newPassword, 10);
    await utilisateur.save();
    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    
    const resetToken = jwt.sign({ id: utilisateur._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Envoyer le token par email (à implémenter)
    res.json({ message: 'Email de réinitialisation envoyé', resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Utilisateur.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    res.status(400).json({ message: 'Token invalide ou expiré' });
  }
};