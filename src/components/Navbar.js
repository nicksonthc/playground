import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Home.css'; // For navbar styling

function Navbar() {
  const location = useLocation();

  // Helper function to determine if a link should be active
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <h2>Playground</h2>
      </div>
      <nav className="navbar-links">
        <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
        <Link to="/pathfinding" className={`nav-link ${isActive('/pathfinding')}`}>Pathfinding</Link>
        <Link to="/game-theory" className={`nav-link ${isActive('/game-theory')}`}>Game Theory</Link>
        <Link to="/project-calculator" className={`nav-link ${isActive('/project-calculator')}`}>Project Calculator</Link>
        <Link to="/algo-ds" className={`nav-link ${isActive('/algo-ds')}`}>AlgoCraft</Link>
      </nav>
    </header>
  );
}

export default Navbar;
