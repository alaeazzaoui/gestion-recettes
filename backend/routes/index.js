const express = require('express');
const router = express.Router();

const allergieRoutes = require("./allergieRoutes");
const conseilSanteRoutes = require('./conseilSanteRoutes');
const etapeRoutes = require('./etapeRoutes');
const elementRecetteRoutes = require('./elementRecetteRoutes');
const favoriRoutes = require('./favoriRoutes');
const ingredientRoutes = require('./ingredientRoutes');
const listeCourseRoutes = require('./listeCourseRoutes');
const notationRoutes = require('./notationRoutes');
const notificationRoutes = require('./notificationRoutes');
const sessionRoutes = require('./sessionRoutes');
const recetteRoutes = require('./recetteRoutes');
const clientRoutes = require('./clientRoutes');
const adminRoutes = require('./adminRoutes');
const categorieRoutes = require('./categorieRoutes');
const utilisateurRoutes = require('./utilisateurRoutes');

router.use("/allergies", allergieRoutes);
router.use('/conseils-sante', conseilSanteRoutes);
router.use('/etapes', etapeRoutes);
router.use('/elements-recette', elementRecetteRoutes);
router.use('/favoris', favoriRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/liste-course', listeCourseRoutes);
router.use('/notations', notationRoutes);
router.use('/notifications', notificationRoutes);
router.use('/sessions', sessionRoutes);
router.use('/recettes', recetteRoutes);
router.use('/clients', clientRoutes);
router.use('/admins', adminRoutes);
router.use('/categories', categorieRoutes);
router.use('/utilisateurs', utilisateurRoutes);

module.exports = router;