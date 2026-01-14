const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/', notificationController.create);
router.patch('/:id/lire', notificationController.markAsLue);
router.delete('/:id', notificationController.delete);

module.exports = router;