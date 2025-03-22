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
          <p>Explore interactive algorithms and simulations</p>
        </section>

        <section className="feature-cards">
          <div className="card">
            <h3>Pathfinding Algorithms</h3>
            <p>
              Visualize different pathfinding techniques like A*, Dijkstra, and
              BFS
            </p>
            <Link to="/pathfinding" className="card-link">
              Explore
            </Link>
          </div>
          <div className="card">
            <h3>Game Theory</h3>
            <p>
              Interact with simulations of game theory concepts and strategies
            </p>
            <Link to="/game-theory" className="card-link">
              Explore
            </Link>
          </div>
          <div className="card">
            <h3>Project Quotation Calculator</h3>
            <p>
              Calculate project costs based on timelines, resources and overhead costs
            </p>
            <Link to="/project-calculator" className="card-link">
              Explore
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
