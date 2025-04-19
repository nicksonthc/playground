import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./Home";
import Pathfinding from "./Pathfinding";
import GameTheory from "./components/GameTheory/GameTheory";
import ProjectCalculator from "./ProjectCalculator";
import Algo from './components/AlgoAndDs/AlgoAndDs';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="pathfinding" element={<Pathfinding />} />
        <Route path="game-theory" element={<GameTheory />} />
        <Route path="project-calculator" element={<ProjectCalculator />} />
        <Route path="algo-ds" element={<Algo />} />
      </Routes>
    </div>
  );
}

export default App;
