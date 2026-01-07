const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/Auth');

// Toutes les routes nécessitent l'authentification
router.use(authMiddleware);

// Obtenir toutes les recettes de l'utilisateur
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des recettes', error: error.message });
  }
});

// Obtenir une recette par ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, userId: req.userId });
    if (!recipe) {
      return res.status(404).json({ message: 'Recette non trouvée' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la recette', error: error.message });
  }
});

// Créer une nouvelle recette
router.post('/', async (req, res) => {
  try {
    const recipeData = {
      ...req.body,
      userId: req.userId
    };
    const recipe = new Recipe(recipeData);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de la recette', error: error.message });
  }
});

// Modifier une recette
router.put('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!recipe) {
      return res.status(404).json({ message: 'Recette non trouvée' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la modification de la recette', error: error.message });
  }
});

// Supprimer une recette
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!recipe) {
      return res.status(404).json({ message: 'Recette non trouvée' });
    }
    res.json({ message: 'Recette supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la recette', error: error.message });
  }
});

// Rechercher des recettes
router.get('/search/query', async (req, res) => {
  try {
    const { q, category, maxTime, ingredients } = req.query;
    let query = { userId: req.userId };

    // Recherche par texte (titre ou ingrédients)
    if (q) {
      query.$text = { $search: q };
    }

    // Filtre par catégorie
    if (category && category !== 'Toutes') {
      query.category = category;
    }

    // Filtre par temps de préparation
    if (maxTime) {
      query.$expr = {
        $lte: [{ $add: ['$prepTime', '$cookTime'] }, parseInt(maxTime)]
      };
    }

    // Filtre par ingrédients (recherche dans les noms d'ingrédients)
    if (ingredients) {
      const ingredientsList = ingredients.split(',').map(i => i.trim());
      query['ingredients.name'] = { 
        $in: ingredientsList.map(i => new RegExp(i, 'i'))
      };
    }

    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la recherche', error: error.message });
  }
});

module.exports = router;