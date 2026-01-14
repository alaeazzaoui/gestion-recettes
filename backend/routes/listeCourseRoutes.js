const express = require('express');
const router = express.Router();
const listeCourseController = require('../controllers/listeCourseController');

router.post('/', listeCourseController.create);
router.put('/:id', listeCourseController.update);
router.patch('/:id/acheter', listeCourseController.markAsAchete);
router.delete('/:id', listeCourseController.delete);

module.exports = router;