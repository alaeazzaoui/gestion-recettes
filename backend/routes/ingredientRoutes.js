const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');

router.get('/', ingredientController.getAll);
router.get('/famille/:famille', ingredientController.getByFamille);  // ← AVANT /:id
router.get('/:id', ingredientController.getById);
router.post('/', ingredientController.create);
router.put('/:id', ingredientController.update);
router.delete('/:id', ingredientController.delete);

module.exports = router;