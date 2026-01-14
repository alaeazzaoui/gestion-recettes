const express = require('express');
const router = express.Router();
const conseilSanteController = require('../controllers/conseilSanteController');

router.get('/', conseilSanteController.getAll);
router.get('/:id', conseilSanteController.getById);
router.post('/', conseilSanteController.create);
router.put('/:id', conseilSanteController.update);
router.delete('/:id', conseilSanteController.delete);

module.exports = router;