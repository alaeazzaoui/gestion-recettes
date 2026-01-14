const express = require('express');
const router = express.Router();
const favoriController = require('../controllers/favoriController');

router.post('/', favoriController.create);
router.delete('/:id', favoriController.delete);
module.exports = router;
