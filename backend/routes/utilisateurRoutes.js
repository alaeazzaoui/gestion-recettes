const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController');

router.post('/login', utilisateurController.login);
router.post('/register', utilisateurController.register);
router.get('/profile', utilisateurController.getProfile);
router.put('/profile', utilisateurController.updateProfile);
router.post('/change-password', utilisateurController.changePassword);
router.post('/forgot-password', utilisateurController.forgotPassword);
router.post('/reset-password', utilisateurController.resetPassword);

module.exports = router;