const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const favoriController = require('../controllers/favoriController');
const listeCourseController = require('../controllers/listeCourseController');
const notationController = require('../controllers/notationController');
const notificationController = require('../controllers/notificationController');
const sessionController = require('../controllers/sessionController');

router.get('/', clientController.getAll);
router.get('/:id', clientController.getById);
router.post('/register', clientController.register);
router.put('/:id', clientController.update);
router.delete('/:id', clientController.delete);

// Routes imbriquées pour les relations client
router.get('/:clientId/favoris', favoriController.getByClient);
router.delete('/:clientId/recettes/:recetteId/favoris', favoriController.deleteByClientAndRecette);
router.get('/:clientId/liste-course', listeCourseController.getByClient);
router.delete('/:clientId/liste-course', listeCourseController.deleteAllByClient);
router.get('/:clientId/notations', notationController.getByClient);
router.get('/:clientId/notifications', notificationController.getByClient);
router.get('/:clientId/notifications/non-lues', notificationController.getNonLues);
router.patch('/:clientId/notifications/lire-tout', notificationController.markAllAsLue);
router.get('/:clientId/sessions', sessionController.getByClient);

module.exports = router;