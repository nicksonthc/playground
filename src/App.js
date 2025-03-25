import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./Home";
import Pathfinding from "./Pathfinding";
import GameTheory from "./GameTheory";
import ProjectCalculator from "./ProjectCalculator";
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="pathfinding" element={<Pathfinding />} />
        <Route path="game-theory" element={<GameTheory />} />
        <Route path="project-calculator" element={<ProjectCalculator />} />
      </Routes>
    </div>
  );
}

export default App;
