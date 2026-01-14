const express = require('express');
const router = express.Router();
const recetteController = require('../controllers/recetteController');
const etapeController = require('../controllers/etapeController');
const elementRecetteController = require('../controllers/elementRecetteController');
const notationController = require('../controllers/notationController');

router.get('/', recetteController.getAll);
router.get('/:id', recetteController.getById);
router.get('/categorie/:categorie', recetteController.getByCategorie);
router.get('/search', recetteController.search);
router.post('/', recetteController.create);
router.put('/:id', recetteController.update);
router.delete('/:id', recetteController.delete);

// Routes imbriquées pour étapes et éléments
router.get('/:recetteId/etapes', etapeController.getByRecette);
router.get('/:recetteId/elements', elementRecetteController.getByRecette);
router.get('/:recetteId/notations', notationController.getByRecette);
router.get('/:recetteId/moyenne', notationController.getMoyenneByRecette);

module.exports = router;