import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🍳 Mes Recettes
        </Link>
        
        {isAuthenticated && (
          <div className="navbar-menu">
            <Link to="/" className="navbar-link">
              Accueil
            </Link>
            <Link to="/create" className="navbar-link navbar-btn-primary">
              + Nouvelle Recette
            </Link>
            <div className="navbar-user">
              <span>Bonjour, {user?.name}</span>
              <button onClick={handleLogout} className="navbar-btn-logout">
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;