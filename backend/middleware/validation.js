const { body, validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.registerValidation = [
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est requis'),
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('motDePasse').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('tel').optional().isMobilePhone().withMessage('Numéro de téléphone invalide'),
  body('skinaObjectId').optional().trim().notEmpty()
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('motDePasse').notEmpty().withMessage('Le mot de passe est requis')
];

exports.updateProfileValidation = [
  body('nom').optional().trim().notEmpty(),
  body('prenom').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('tel').optional().isMobilePhone()
];

exports.changePasswordValidation = [
  body('oldPassword').notEmpty().withMessage('L\'ancien mot de passe est requis'),
  body('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
];

exports.categorieValidation = [
  body('nom').trim().notEmpty().withMessage('Le nom de la catégorie est requis')
];