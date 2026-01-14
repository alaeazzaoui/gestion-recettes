const express = require('express');
const router = express.Router();
const notationController = require('../controllers/notationController');

router.post('/', notationController.create);
router.put('/:id', notationController.update);
router.delete('/:id', notationController.delete);

module.exports = router;