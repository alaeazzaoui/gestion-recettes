const express = require('express');
const router = express.Router();

// Importez votre contrôleur
const {
  getRecipeById,
  getAllRecipes,
  getPopularRecipes,
  searchRecipes,
  filterRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeViews
} = require('../controllers/recipeController');

// Routes publiques (sans authentification)

/**
 * @route   GET /api/recipes/popular
 * @desc    Récupérer les recettes les plus populaires (depuis Redis)
 * @access  Public
 */
router.get('/popular', getPopularRecipes);

/**
 * @route   GET /api/recipes/search
 * @desc    Rechercher des recettes
 * @access  Public
 */
router.get('/search', searchRecipes);

/**
 * @route   GET /api/recipes/:id
 * @desc    Récupérer une recette par ID
 * @access  Public
 */
router.get('/:id', getRecipeById);

/**
 * @route   GET /api/recipes/:id/views
 * @desc    Récupérer le nombre de vues d'une recette
 * @access  Public
 */
router.get('/:id/views', getRecipeViews);

/**
 * @route   GET /api/recipes
 * @desc    Récupérer toutes les recettes avec pagination
 * @access  Public
 */
router.get('/', getAllRecipes);

/**
 * @route   POST /api/recipes/filter
 * @desc    Filtrer les recettes par catégories et régimes
 * @access  Public
 */
router.post('/filter', filterRecipes);

// Routes protégées (nécessitent une authentification)
// Ajoutez votre middleware d'authentification si nécessaire
// const { authMiddleware } = require('../middleware/auth');

/**
 * @route   POST /api/recipes
 * @desc    Créer une nouvelle recette
 * @access  Private
 */
router.post('/', /* authMiddleware, */ createRecipe);

/**
 * @route   PUT /api/recipes/:id
 * @desc    Mettre à jour une recette
 * @access  Private
 */
router.put('/:id', /* authMiddleware, */ updateRecipe);

/**
 * @route   DELETE /api/recipes/:id
 * @desc    Supprimer une recette
 * @access  Private
 */
router.delete('/:id', /* authMiddleware, */ deleteRecipe);

module.exports = router;