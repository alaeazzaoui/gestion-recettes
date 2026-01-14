// ============================================
// Contrôleur des Recettes avec Redis
// ============================================

const recipeService = require('../recipe-service');
// Importez votre modèle Recipe ici
// const Recipe = require('../models/Recipe');

/**
 * Récupérer une recette par ID
 * GET /api/recipes/:id
 */
const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Remplacez Recipe par votre modèle
    // const recipe = await recipeService.getRecipeById(id, Recipe);
    
    // Pour le moment, exemple sans modèle :
    const recipe = await recipeService.getRecipeById(id, YourRecipeModel);
    
    if (!recipe) {
      return res.status(404).json({ 
        success: false,
        message: 'Recette non trouvée' 
      });
    }

    // Récupérer le nombre de vues
    const views = await recipeService.getViews(id);

    res.json({
      success: true,
      data: {
        ...recipe.toObject(),
        views
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la recette:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

/**
 * Récupérer toutes les recettes avec pagination
 * GET /api/recipes?page=1&limit=10
 */
const getAllRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await recipeService.getAllRecipes(page, limit, YourRecipeModel);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

/**
 * Récupérer les recettes les plus populaires
 * GET /api/recipes/popular?count=10
 */
const getPopularRecipes = async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 10;

    const recipes = await recipeService.getPopularRecipes(count, YourRecipeModel);

    res.json({
      success: true,
      data: recipes
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes populaires:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

/**
 * Rechercher des recettes
 * GET /api/recipes/search?q=query
 */
const searchRecipes = async (req, res) => {
  try {
    const { q: query } = req.query;

    if (!query) {
      return res.status(400).json({ 
        success: false,
        message: 'Query parameter requis' 
      });
    }

    const recipes = await recipeService.searchRecipes(query, YourRecipeModel);

    res.json({
      success: true,
      data: recipes
    });
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

/**
 * Filtrer les recettes
 * POST /api/recipes/filter
 * Body: { categories: [...], regimes: [...] }
 */
const filterRecipes = async (req, res) => {
  try {
    const { categories, regimes } = req.body;

    const recipes = await recipeService.filterRecipes(
      { categories, regimes }, 
      YourRecipeModel
    );

    res.json({
      success: true,
      data: recipes
    });
  } catch (error) {
    console.error('Erreur lors du filtrage:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

/**
 * Créer une nouvelle recette
 * POST /api/recipes
 */
const createRecipe = async (req, res) => {
  try {
    const recipeData = req.body;

    const recipe = await recipeService.createRecipe(recipeData, YourRecipeModel);

    res.status(201).json({
      success: true,
      message: 'Recette créée avec succès',
      data: recipe
    });
  } catch (error) {
    console.error('Erreur lors de la création de la recette:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

/**
 * Mettre à jour une recette
 * PUT /api/recipes/:id
 */
const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipeData = req.body;

    const recipe = await recipeService.updateRecipe(id, recipeData, YourRecipeModel);

    if (!recipe) {
      return res.status(404).json({ 
        success: false,
        message: 'Recette non trouvée' 
      });
    }

    res.json({
      success: true,
      message: 'Recette mise à jour avec succès',
      data: recipe
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la recette:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

/**
 * Supprimer une recette
 * DELETE /api/recipes/:id
 */
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    await recipeService.deleteRecipe(id, YourRecipeModel);

    res.json({
      success: true,
      message: 'Recette supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la recette:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

/**
 * Récupérer le nombre de vues d'une recette
 * GET /api/recipes/:id/views
 */
const getRecipeViews = async (req, res) => {
  try {
    const { id } = req.params;
    const views = await recipeService.getViews(id);

    res.json({
      success: true,
      data: { views }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des vues:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

module.exports = {
  getRecipeById,
  getAllRecipes,
  getPopularRecipes,
  searchRecipes,
  filterRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeViews
};