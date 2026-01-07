import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { recipeAPI } from '../utils/api';
import './RecipeForm.css';

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Plat',
    prepTime: '',
    cookTime: '',
    servings: 4,
    difficulty: 'Moyen',
    image: ''
  });

  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [steps, setSteps] = useState([{ order: 1, description: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadRecipe();
    }
  }, [id]);

  const loadRecipe = async () => {
    try {
      const response = await recipeAPI.getById(id);
      const recipe = response.data;
      setFormData({
        title: recipe.title,
        description: recipe.description || '',
        category: recipe.category,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        image: recipe.image || ''
      });
      setIngredients(recipe.ingredients);
      setSteps(recipe.steps);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Impossible de charger la recette');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => {
    setSteps([...steps, { order: steps.length + 1, description: '' }]);
  };

  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].description = value;
    setSteps(newSteps);
  };

  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, order: i + 1 }));
    setSteps(newSteps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const recipeData = {
        ...formData,
        ingredients: ingredients.filter(ing => ing.name.trim() !== ''),
        steps: steps.filter(step => step.description.trim() !== '')
      };

      if (isEditing) {
        await recipeAPI.update(id, recipeData);
      } else {
        await recipeAPI.create(recipeData);
      }

      navigate('/');
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-form-container">
      <div className="recipe-form-card">
        <h1>{isEditing ? '✏️ Modifier la recette' : '➕ Nouvelle recette'}</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="form-section">
            <h2>Informations générales</h2>

            <div className="form-group">
              <label>Titre *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Tarte aux pommes"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Décrivez votre recette..."
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Catégorie *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Entrée">Entrée</option>
                  <option value="Plat">Plat</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Boisson">Boisson</option>
                  <option value="Apéritif">Apéritif</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label>Difficulté *</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Facile">Facile</option>
                  <option value="Moyen">Moyen</option>
                  <option value="Difficile">Difficile</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Temps de préparation (min) *</label>
                <input
                  type="number"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Temps de cuisson (min) *</label>
                <input
                  type="number"
                  name="cookTime"
                  value={formData.cookTime}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Portions *</label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>URL de l'image</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://exemple.com/image.jpg"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Ingrédients</h2>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <input
                  type="text"
                  placeholder="Nom"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Quantité"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Unité"
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="btn-remove"
                >
                  🗑️
                </button>
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="btn-add">
              + Ajouter un ingrédient
            </button>
          </div>

          <div className="form-section">
            <h2>Étapes de préparation</h2>
            {steps.map((step, index) => (
              <div key={index} className="step-row">
                <span className="step-number">{index + 1}</span>
                <textarea
                  placeholder="Décrivez cette étape..."
                  value={step.description}
                  onChange={(e) => updateStep(index, e.target.value)}
                  rows="2"
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="btn-remove"
                >
                  🗑️
                </button>
              </div>
            ))}
            <button type="button" onClick={addStep} className="btn-add">
              + Ajouter une étape
            </button>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-cancel"
            >
              Annuler
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Enregistrement...' : isEditing ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;