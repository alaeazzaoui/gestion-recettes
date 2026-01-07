import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipeCard.css';

const RecipeCard = ({ recipe, onDelete }) => {
  const navigate = useNavigate();
  const totalTime = recipe.prepTime + recipe.cookTime;

  const handleView = () => {
    navigate(`/recipe/${recipe._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      onDelete(recipe._id);
    }
  };

  return (
    <div className="recipe-card" onClick={handleView}>
      <div className="recipe-card-header">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} className="recipe-card-image" />
        ) : (
          <div className="recipe-card-image-placeholder">
            <span>🍽️</span>
          </div>
        )}
        <div className="recipe-card-category">{recipe.category}</div>
      </div>
      
      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <p className="recipe-card-description">
          {recipe.description?.substring(0, 100)}
          {recipe.description?.length > 100 ? '...' : ''}
        </p>
        
        <div className="recipe-card-info">
          <span className="recipe-info-item">
            ⏱️ {totalTime} min
          </span>
          <span className="recipe-info-item">
            👥 {recipe.servings} pers.
          </span>
          <span className={`recipe-difficulty recipe-difficulty-${recipe.difficulty?.toLowerCase()}`}>
            {recipe.difficulty}
          </span>
        </div>
        
        <div className="recipe-card-actions">
          <button className="btn-view" onClick={handleView}>
            Voir la recette
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;