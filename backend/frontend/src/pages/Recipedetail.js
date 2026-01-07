import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeAPI } from '../utils/api';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [servings, setServings] = useState(4);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const response = await recipeAPI.getById(id);
      setRecipe(response.data);
      setServings(response.data.servings);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const adjustServings = (newServings) => {
    setServings(Math.max(1, newServings));
  };

  const getAdjustedQuantity = (quantity) => {
    if (!recipe) return quantity;
    const ratio = servings / recipe.servings;
    const num = parseFloat(quantity);
    if (isNaN(num)) return quantity;
    return (num * ratio).toFixed(1);
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      try {
        await recipeAPI.delete(id);
        navigate('/');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading-container">Chargement...</div>;
  }

  if (!recipe) {
    return <div className="error-container">Recette non trouvée</div>;
  }

  const totalTime = recipe.prepTime + recipe.cookTime;

  if (cookingMode) {
    return (
      <div className="cooking-mode">
        <div className="cooking-header">
          <button onClick={() => setCookingMode(false)} className="btn-exit-cooking">
            ← Quitter le mode cuisine
          </button>
          <h2>{recipe.title}</h2>
          <div className="step-counter">
            Étape {currentStep + 1} / {recipe.steps.length}
          </div>
        </div>

        <div className="cooking-content">
          <div className="current-step">
            <div className="step-number-large">{currentStep + 1}</div>
            <p className="step-description-large">
              {recipe.steps[currentStep].description}
            </p>
          </div>

          <div className="cooking-navigation">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="btn-nav"
            >
              ← Précédent
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(recipe.steps.length - 1, currentStep + 1))}
              disabled={currentStep === recipe.steps.length - 1}
              className="btn-nav btn-nav-primary"
            >
              Suivant →
            </button>
          </div>

          {currentStep === recipe.steps.length - 1 && (
            <div className="cooking-complete">
              🎉 Votre recette est terminée ! Bon appétit !
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-card">
        {recipe.image && (
          <div className="recipe-detail-image">
            <img src={recipe.image} alt={recipe.title} />
          </div>
        )}

        <div className="recipe-detail-header">
          <div className="header-content">
            <h1>{recipe.title}</h1>
            <p className="recipe-description">{recipe.description}</p>

            <div className="recipe-meta">
              <span className="meta-item">
                📁 {recipe.category}
              </span>
              <span className="meta-item">
                ⏱️ {totalTime} min
              </span>
              <span className={`meta-item difficulty-${recipe.difficulty?.toLowerCase()}`}>
                {recipe.difficulty}
              </span>
            </div>
          </div>

          <div className="header-actions">
            <button onClick={handleEdit} className="btn-action btn-edit">
              ✏️ Modifier
            </button>
            <button onClick={handleDelete} className="btn-action btn-delete">
              🗑️ Supprimer
            </button>
          </div>
        </div>

        <div className="recipe-detail-content">
          <div className="ingredients-section">
            <div className="section-header">
              <h2>Ingrédients</h2>
              <div className="servings-adjuster">
                <button onClick={() => adjustServings(servings - 1)}>−</button>
                <span>{servings} personnes</span>
                <button onClick={() => adjustServings(servings + 1)}>+</button>
              </div>
            </div>

            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  <span className="ingredient-name">{ingredient.name}</span>
                  <span className="ingredient-quantity">
                    {getAdjustedQuantity(ingredient.quantity)} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="steps-section">
            <h2>Préparation</h2>
            <div className="steps-list">
              {recipe.steps.map((step, index) => (
                <div key={index} className="step-item">
                  <div className="step-number">{step.order}</div>
                  <p className="step-description">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="recipe-detail-footer">
          <button onClick={() => setCookingMode(true)} className="btn-cooking-mode">
            🍳 Lancer le mode cuisine
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;