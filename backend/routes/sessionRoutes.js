const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/login', sessionController.login);
router.post('/logout', sessionController.logout);
router.get('/verify', sessionController.verify);
router.delete('/:id', sessionController.delete);

module.exports = router;