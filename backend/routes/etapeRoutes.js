const express = require('express');
const router = express.Router();
const etapeController = require('../controllers/etapeController');

router.get('/', etapeController.getAll);
router.get('/:id', etapeController.getById);
router.post('/', etapeController.create);
router.put('/:id', etapeController.update);
router.delete('/:id', etapeController.delete);

module.exports = router;