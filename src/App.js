import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Pathfinding from "./Pathfinding";
import GameTheory from "./GameTheory";
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pathfinding" element={<Pathfinding />} />
        <Route path="/game-theory" element={<GameTheory />} />
      </Routes>
    </div>
  );
}

export default App;
