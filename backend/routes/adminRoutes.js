const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getAll);
router.get('/:id', adminController.getById);
router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.put('/:id', adminController.update);
router.delete('/:id', adminController.delete);

module.exports = router;
