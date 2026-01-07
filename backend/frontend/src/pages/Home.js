import React, { useState, useEffect } from 'react';
import { recipeAPI } from '../utils/api';
import RecipeCard from '../components/Recipecard';
import './Home.css';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Toutes');
  const [timeFilter, setTimeFilter] = useState('');

  const categories = ['Toutes', 'Entrée', 'Plat', 'Dessert', 'Boisson', 'Apéritif', 'Autre'];

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [searchTerm, categoryFilter, timeFilter, recipes]);

  const loadRecipes = async () => {
    try {
      const response = await recipeAPI.getAll();
      setRecipes(response.data);
      setFilteredRecipes(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des recettes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = [...recipes];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ing =>
          ing.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filtre par catégorie
    if (categoryFilter !== 'Toutes') {
      filtered = filtered.filter(recipe => recipe.category === categoryFilter);
    }

    // Filtre par temps
    if (timeFilter) {
      filtered = filtered.filter(recipe => {
        const totalTime = recipe.prepTime + recipe.cookTime;
        return totalTime <= parseInt(timeFilter);
      });
    }

    setFilteredRecipes(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await recipeAPI.delete(id);
      setRecipes(recipes.filter(recipe => recipe._id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la recette');
    }
  };

  if (loading) {
    return <div className="loading-container">Chargement des recettes...</div>;
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Mes Recettes</h1>
        <p>Découvrez et gérez votre collection de recettes</p>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Rechercher par titre, ingrédient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-row">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les temps</option>
            <option value="30">Moins de 30 min</option>
            <option value="60">Moins d'1 heure</option>
            <option value="120">Moins de 2 heures</option>
          </select>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="no-recipes">
          <p>😔 Aucune recette trouvée</p>
          {recipes.length === 0 && (
            <p>Commencez par créer votre première recette !</p>
          )}
        </div>
      ) : (
        <div className="recipes-grid">
          {filteredRecipes.map(recipe => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;