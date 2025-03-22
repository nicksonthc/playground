import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // You'll need to create this CSS file

function Home() {
  return (
    <div className="home-container">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="navbar-logo">
          <h2>Playground</h2>
        </div>
        <nav className="navbar-links">
          <Link to="/" className="nav-link active">Home</Link>
          <Link to="/pathfinding" className="nav-link">Pathfinding</Link>
          <Link to="/game-theory" className="nav-link">Game Theory</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <section className="hero-section">
          <h1>Welcome to My Playground</h1>
          <p>Explore interactive algorithms and simulations</p>
        </section>

        <section className="feature-cards">
          <div className="card">
            <h3>Pathfinding Algorithms</h3>
            <p>Visualize different pathfinding techniques like A*, Dijkstra, and BFS</p>
            <Link to="/pathfinding" className="card-link">Explore</Link>
          </div>
          <div className="card">
            <h3>Game Theory</h3>
            <p>Interact with simulations of game theory concepts and strategies</p>
            <Link to="/game-theory" className="card-link">Explore</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
