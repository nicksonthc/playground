import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // You'll need to create this CSS file
import Navbar from './components/Navbar'; // Import the Navbar component

function Home() {
  return (
    <div className="home-container">
      <Navbar />

      {/* Main Content */}
      <main className="main-content">
        <section className="hero-section">
          <h1>Welcome to My Playground</h1>
          <p>Discover interactive tools and simulations</p>
        </section>

        <section className="feature-cards">
          <div className="card">
            <h3>Pathfinding Algorithms</h3>
            <p>
              🧭 Navigate the Maze: Master the Art of Pathfinding Algorithms
            </p>
            <Link to="/pathfinding" className="card-link">
              Explore
            </Link>
          </div>
          <div className="card">
            <h3>Game Theory</h3>
            <p>
              🎲 Strategic Insights: Unravel the Dynamics of Game Theory
            </p>
            <Link to="/game-theory" className="card-link">
              Explore
            </Link>
          </div>
          <div className="card">
            <h3>Project Quotation Calculator</h3>
            <p>
              💼 Plan with Precision: Estimate Costs with Confidence
            </p>
            <Link to="/project-calculator" className="card-link">
              Explore
            </Link>
          </div>
          <div className="card">
            <h3>Data & Algorithms</h3>
            <p>
              ⚙️ Dive Deep: Explore the Intricacies of Data & Algorithms
            </p>
            <Link to="/algo-ds" className="card-link">
              Explore
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
