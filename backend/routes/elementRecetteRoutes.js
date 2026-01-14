const express = require('express');
const router = express.Router();
const elementRecetteController = require('../controllers/elementRecetteController');

router.get('/', elementRecetteController.getAll);
router.get('/:id', elementRecetteController.getById);
router.post('/', elementRecetteController.create);
router.put('/:id', elementRecetteController.update);
router.delete('/:id', elementRecetteController.delete);

module.exports = router;