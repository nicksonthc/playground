import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Navbar from './components/Navbar';

function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: "Pathfinding Algorithms",
      description: "Navigate the Maze: Master the Art of Pathfinding Algorithms",
      icon: "fas fa-route",
      path: "/pathfinding",
      color: "#ff6b6b",
      stats: "A* Algorithm"
    },
    {
      title: "Game Theory",
      description: "Strategic Insights: Unravel the Dynamics of Game Theory",
      icon: "fas fa-chess",
      path: "/game-theory",
      color: "#4ecdc4",
      stats: "Nash Equilibrium"
    },
    {
      title: "Project Calculator",
      description: "Plan with Precision: Estimate Costs with Confidence",
      icon: "fas fa-calculator",
      path: "/project-calculator",
      color: "#45b7d1",
      stats: "Cost Estimation"
    },
    {
      title: "Data & Algorithms",
      description: "Dive Deep: Explore the Intricacies of Data & Algorithms",
      icon: "fas fa-code-branch",
      path: "/algo-ds",
      color: "#f9ca24",
      stats: "Interactive DS"
    }
  ];

  return (
    <div className="home-container">
      <Navbar />

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className={`hero-section ${isVisible ? 'fade-in' : ''}`}>
          <div className="hero-content">
            <div className="hero-badge">
              <i className="fas fa-rocket"></i>
              <span>Interactive Learning Platform</span>
            </div>
            <h1 className="hero-title">
              Welcome to My <span className="gradient-text">NickSpace</span>
            </h1>
            <p className="hero-subtitle">
              Discover interactive tools, visualizations, and simulations designed to make learning algorithms and programming concepts engaging and intuitive.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">4</span>
                <span className="stat-label">Interactive Tools</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">∞</span>
                <span className="stat-label">Learning Opportunities</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Open Source</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-elements">
              <div className="floating-card" style={{animationDelay: '0s'}}>
                <i className="fas fa-brain"></i>
              </div>
              <div className="floating-card" style={{animationDelay: '0.5s'}}>
                <i className="fas fa-lightbulb"></i>
              </div>
              <div className="floating-card" style={{animationDelay: '1s'}}>
                <i className="fas fa-cogs"></i>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2>Explore Interactive Tools</h2>
            <p>Choose your learning adventure from our collection of interactive educational tools</p>
          </div>
          
          <div className="feature-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card ${isVisible ? 'slide-up' : ''}`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="card-header">
                  <div className="card-icon" style={{backgroundColor: feature.color}}>
                    <i className={feature.icon}></i>
                  </div>
                  <div className="card-stats">
                    <span className="stats-badge">{feature.stats}</span>
                  </div>
                </div>
                <div className="card-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
                <div className="card-footer">
                  <Link to={feature.path} className="card-link">
                    <span>Explore</span>
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>NickSpace</h4>
            <p>Making learning algorithms and programming concepts interactive and fun.</p>
            <div className="social-links">
              <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
          <div className="footer-section">
            <h5>Quick Links</h5>
            <ul>
              <li><Link to="/pathfinding">Pathfinding</Link></li>
              <li><Link to="/game-theory">Game Theory</Link></li>
              <li><Link to="/project-calculator">Calculator</Link></li>
              <li><Link to="/algo-ds">Algorithms</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h5>Technologies</h5>
            <ul>
              <li>React.js</li>
              <li>Chart.js</li>
              <li>Bootstrap</li>
              <li>JavaScript</li>
            </ul>
          </div>
          <div className="footer-section">
            <h5>Contact</h5>
            <p>Built with ❤️ for learning</p>
            <p className="footer-email">nicksonthc@gmail.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Interactive NickSpace. Made for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
