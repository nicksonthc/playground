import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Home.css'; // For navbar styling

function Navbar() {
  const location = useLocation();
  const basename = "/playground"; // Add basename for GitHub Pages routing
  
  // Helper function to determine if a link should be active
  const isActive = (path) => {
    return location.pathname === `${basename}${path}` ? 'active' : '';
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <h2>Playground</h2>
      </div>
      <nav className="navbar-links">
        <Link to={`${basename}/`} className={`nav-link ${isActive('/')}`}>Home</Link>
        <Link to={`${basename}/pathfinding`} className={`nav-link ${isActive('/pathfinding')}`}>Pathfinding</Link>
        <Link to={`${basename}/game-theory`} className={`nav-link ${isActive('/game-theory')}`}>Game Theory</Link>
        <Link to={`${basename}/project-calculator`} className={`nav-link ${isActive('/project-calculator')}`}>Project Calculator</Link>
      </nav>
    </header>
  );
}

export default Navbar;
