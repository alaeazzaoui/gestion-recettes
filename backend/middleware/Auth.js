const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Non autorisé, token manquant' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Utilisateur.findById(decoded.id).select('-motDePasse');
    
    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.__t || 'Utilisateur')) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    next();
  };
};