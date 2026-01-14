const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');

router.get('/', categorieController.getAll);
router.get('/:id', categorieController.getById);
router.post('/', categorieController.create);
router.put('/:id', categorieController.update);
router.delete('/:id', categorieController.delete);

module.exports = router;