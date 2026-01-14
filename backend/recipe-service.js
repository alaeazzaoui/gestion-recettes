const cacheService = require('./cache-service');

class RecipeService {
  constructor() {
    this.CACHE_PREFIX = 'recipe:';
    this.POPULAR_RECIPES_KEY = 'popular:recipes';
    this.VIEWS_PREFIX = 'views:';
    this.CACHE_TTL = 3600; // 1 heure
    this.SEARCH_CACHE_TTL = 900; // 15 minutes
    this.LIST_CACHE_TTL = 300; // 5 minutes
  }

  /**
   * Récupérer une recette par ID (avec cache)
   */
  async getRecipeById(recipeId, RecipeModel) {
    const cacheKey = `${this.CACHE_PREFIX}${recipeId}`;

    // 1. Vérifier le cache
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      console.log(`✅ Cache hit pour la recette: ${recipeId}`);
      // Incrémenter les vues
      await this.incrementViews(recipeId);
      return cached;
    }

    // 2. Récupérer depuis MongoDB
    const recipe = await RecipeModel.findById(recipeId);
    if (!recipe) {
      return null;
    }

    // 3. Mettre en cache
    await cacheService.set(cacheKey, recipe, this.CACHE_TTL);
    await this.incrementViews(recipeId);

    return recipe;
  }

  /**
   * Récupérer toutes les recettes avec pagination (avec cache)
   */
  async getAllRecipes(page, limit, RecipeModel) {
    const cacheKey = `recipes:page:${page}:limit:${limit}`;

    // Vérifier le cache
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      console.log(`✅ Cache hit pour la liste page ${page}`);
      return cached;
    }

    // Récupérer depuis MongoDB
    const skip = (page - 1) * limit;
    const recipes = await RecipeModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await RecipeModel.countDocuments();

    const result = {
      recipes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecipes: total
    };

    // Mettre en cache pour 5 minutes
    await cacheService.set(cacheKey, result, this.LIST_CACHE_TTL);

    return result;
  }

  /**
   * Créer une nouvelle recette
   */
  async createRecipe(recipeData, RecipeModel) {
    const recipe = await RecipeModel.create(recipeData);

    // Invalider le cache des listes
    await cacheService.delPattern('recipes:page:*');

    return recipe;
  }

  /**
   * Mettre à jour une recette
   */
  async updateRecipe(recipeId, recipeData, RecipeModel) {
    const recipe = await RecipeModel.findByIdAndUpdate(recipeId, recipeData, { new: true });

    if (recipe) {
      // Invalider le cache
      await cacheService.del(`${this.CACHE_PREFIX}${recipeId}`);
      await cacheService.delPattern('recipes:page:*');
      await cacheService.delPattern('search:*');
    }

    return recipe;
  }

  /**
   * Supprimer une recette
   */
  async deleteRecipe(recipeId, RecipeModel) {
    await RecipeModel.findByIdAndDelete(recipeId);

    // Invalider le cache
    await cacheService.del(`${this.CACHE_PREFIX}${recipeId}`);
    await cacheService.del(`${this.VIEWS_PREFIX}${recipeId}`);
    await cacheService.delPattern('recipes:page:*');
    await cacheService.delPattern('search:*');
    
    // Retirer du classement des recettes populaires
    // Note: Redis ne supporte pas directement la suppression par valeur dans un sorted set
    // Il faudrait utiliser zRem avec le membre
  }

  /**
   * Incrémenter le compteur de vues d'une recette
   */
  async incrementViews(recipeId) {
    const viewsKey = `${this.VIEWS_PREFIX}${recipeId}`;
    const views = await cacheService.increment(viewsKey);
    
    // Ajouter au classement des recettes populaires (sorted set)
    await cacheService.addToSortedSet(this.POPULAR_RECIPES_KEY, views, recipeId);
    
    return views;
  }

  /**
   * Récupérer le nombre de vues d'une recette
   */
  async getViews(recipeId) {
    const viewsKey = `${this.VIEWS_PREFIX}${recipeId}`;
    const views = await cacheService.get(viewsKey);
    return views || 0;
  }

  /**
   * Récupérer les recettes les plus populaires
   */
  async getPopularRecipes(count, RecipeModel) {
    const cacheKey = `popular:top:${count}`;

    // Vérifier le cache
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      console.log(`✅ Cache hit pour les recettes populaires`);
      return cached;
    }

    // Récupérer les IDs des recettes populaires depuis le sorted set
    const popularIds = await cacheService.getSortedSet(this.POPULAR_RECIPES_KEY, count);

    if (popularIds.length === 0) {
      // Si aucune vue enregistrée, récupérer les recettes les plus récentes
      const recipes = await RecipeModel.find().sort({ createdAt: -1 }).limit(count);
      await cacheService.set(cacheKey, recipes, 600); // Cache 10 minutes
      return recipes;
    }

    // Récupérer les recettes depuis MongoDB
    const recipes = await RecipeModel.find({ _id: { $in: popularIds } });

    // Trier selon l'ordre des IDs populaires
    const sortedRecipes = popularIds
      .map(id => recipes.find(r => r._id.toString() === id))
      .filter(Boolean);

    // Ajouter le nombre de vues à chaque recette
    const recipesWithViews = await Promise.all(
      sortedRecipes.map(async (recipe) => {
        const views = await this.getViews(recipe._id.toString());
        return {
          ...recipe.toObject(),
          views
        };
      })
    );

    // Mettre en cache pour 10 minutes
    await cacheService.set(cacheKey, recipesWithViews, 600);

    return recipesWithViews;
  }

  /**
   * Rechercher des recettes (avec cache)
   */
  async searchRecipes(query, RecipeModel) {
    const cacheKey = `search:${query.toLowerCase()}`;

    // Vérifier le cache
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      console.log(`✅ Cache hit pour la recherche: ${query}`);
      return cached;
    }

    // Recherche dans MongoDB
    const recipes = await RecipeModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { ingredients: { $regex: query, $options: 'i' } }
      ]
    });

    // Mettre en cache pour 15 minutes
    await cacheService.set(cacheKey, recipes, this.SEARCH_CACHE_TTL);

    return recipes;
  }

  /**
   * Filtrer les recettes par catégories et régimes
   */
  async filterRecipes(filters, RecipeModel) {
    const { categories, regimes } = filters;
    
    // Construire la requête MongoDB
    const query = {};
    
    if (categories && categories.length > 0) {
      query.category = { $in: categories };
    }
    
    if (regimes && regimes.length > 0) {
      query.regime = { $in: regimes };
    }

    // Récupérer les recettes
    const recipes = await RecipeModel.find(query).sort({ createdAt: -1 });

    return recipes;
  }

  /**
   * Initialiser les vues pour les recettes existantes
   * (À exécuter une seule fois pour migrer les données)
   */
  async initializeViews(RecipeModel) {
    console.log('🔄 Initialisation des vues des recettes...');
    
    const recipes = await RecipeModel.find();
    
    for (const recipe of recipes) {
      // Si la recette a un champ views dans MongoDB, l'utiliser
      const views = recipe.views || 0;
      
      if (views > 0) {
        const viewsKey = `${this.VIEWS_PREFIX}${recipe._id}`;
        await cacheService.set(viewsKey, views);
        await cacheService.addToSortedSet(this.POPULAR_RECIPES_KEY, views, recipe._id.toString());
      }
    }
    
    console.log(`✅ ${recipes.length} recettes initialisées dans Redis`);
  }
}

// Instance singleton
const recipeService = new RecipeService();

module.exports = recipeService;