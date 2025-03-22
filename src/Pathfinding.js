import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // For navbar styling
import './components/Pathfinding/PathfindingPage.css'; // For grid styling

function Pathfinding() {
  // Grid dimensions
  const rows = 10;
  const cols = 10;

  // State management
  const [grid, setGrid] = useState([]);
  const [robotPos, setRobotPos] = useState(null);
  const [destPos, setDestPos] = useState(null);
  const [path, setPath] = useState([]);
  const [isComputing, setIsComputing] = useState(false);
  const [cellType, setCellType] = useState('robot'); // 'robot', 'destination', 'wall'

  // Initialize grid
  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid = Array(rows).fill().map((_, rowIdx) =>
      Array(cols).fill().map((_, colIdx) => ({
        row: rowIdx,
        col: colIdx,
        isRobot: false,
        isDestination: false,
        isWall: false,
        isPath: false,
      }))
    );
    setGrid(newGrid);
    setRobotPos(null);
    setDestPos(null);
    setPath([]);
  };

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (isComputing) return;

    const newGrid = [...grid];
    const cell = newGrid[row][col];

    if (cellType === 'robot') {
      // Clear previous robot position
      if (robotPos) {
        newGrid[robotPos.row][robotPos.col].isRobot = false;
      }
      cell.isRobot = true;
      setRobotPos({ row, col });
    } else if (cellType === 'destination') {
      // Clear previous destination
      if (destPos) {
        newGrid[destPos.row][destPos.col].isDestination = false;
      }
      cell.isDestination = true;
      setDestPos({ row, col });
    } else if (cellType === 'wall') {
      // Toggle walls
      cell.isWall = !cell.isWall;
      
      // If placing a wall on robot or destination, remove them
      if (cell.isWall) {
        if (cell.isRobot) {
          cell.isRobot = false;
          setRobotPos(null);
        }
        if (cell.isDestination) {
          cell.isDestination = false;
          setDestPos(null);
        }
      }
    }

    // Clear previous path when anything changes
    clearPath(newGrid);
    setGrid(newGrid);
  };

  const clearPath = (currentGrid) => {
    const newGrid = currentGrid || [...grid];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        newGrid[i][j].isPath = false;
      }
    }
    setPath([]);
    return newGrid;
  };

  const resetGrid = () => {
    initializeGrid();
  };

  // Compute path using A* algorithm
  const computePath = () => {
    if (!robotPos || !destPos) {
      alert('Please select both a robot position and a destination');
      return;
    }

    setIsComputing(true);
    setTimeout(() => {
      const result = aStarAlgorithm(robotPos, destPos);
      visualizePath(result);
      setIsComputing(false);
    }, 100);
  };

  // A* algorithm implementation
  const aStarAlgorithm = (start, end) => {
    // Create openSet and closedSet
    const openSet = [start];
    const closedSet = [];
    
    // Initialize g and f scores for all nodes
    const gScore = {};
    const fScore = {};
    const cameFrom = {};
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const key = `${i}-${j}`;
        gScore[key] = Infinity;
        fScore[key] = Infinity;
      }
    }
    
    const startKey = `${start.row}-${start.col}`;
    gScore[startKey] = 0;
    fScore[startKey] = heuristic(start, end);
    
    while (openSet.length > 0) {
      // Find the node in openSet with the lowest fScore
      let lowestIndex = 0;
      for (let i = 0; i < openSet.length; i++) {
        const key = `${openSet[i].row}-${openSet[i].col}`;
        const lowestKey = `${openSet[lowestIndex].row}-${openSet[lowestIndex].col}`;
        if (fScore[key] < fScore[lowestKey]) {
          lowestIndex = i;
        }
      }
      
      const current = openSet[lowestIndex];
      const currentKey = `${current.row}-${current.col}`;
      
      // If we've reached the end
      if (current.row === end.row && current.col === end.col) {
        // Reconstruct path
        return reconstructPath(cameFrom, current);
      }
      
      // Remove current from openSet
      openSet.splice(lowestIndex, 1);
      closedSet.push(current);
      
      // Check all neighbors
      const neighbors = getNeighbors(current);
      
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row}-${neighbor.col}`;
        
        // If neighbor is in closedSet or is a wall, skip
        if (closedSet.some(node => node.row === neighbor.row && node.col === neighbor.col) ||
            grid[neighbor.row][neighbor.col].isWall) {
          continue;
        }
        
        // Calculate tentative gScore
        const tentativeGScore = gScore[currentKey] + 1;
        
        // If neighbor is not in openSet, add it
        const neighborInOpenSet = openSet.some(node => node.row === neighbor.row && node.col === neighbor.col);
        if (!neighborInOpenSet) {
          openSet.push(neighbor);
        } else if (tentativeGScore >= gScore[neighborKey]) {
          // If this path is not better than previous, skip
          continue;
        }
        
        // This path is the best until now, record it
        cameFrom[neighborKey] = current;
        gScore[neighborKey] = tentativeGScore;
        fScore[neighborKey] = gScore[neighborKey] + heuristic(neighbor, end);
      }
    }
    
    // No path found
    return [];
  };

  // Manhattan distance heuristic
  const heuristic = (a, b) => {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  };

  // Get valid neighbors of a cell
  const getNeighbors = (node) => {
    const { row, col } = node;
    const neighbors = [];
    
    // Check all 4 directions
    if (row > 0) neighbors.push({ row: row - 1, col: col }); // Up
    if (row < rows - 1) neighbors.push({ row: row + 1, col: col }); // Down
    if (col > 0) neighbors.push({ row: row, col: col - 1 }); // Left
    if (col < cols - 1) neighbors.push({ row: row, col: col + 1 }); // Right
    
    return neighbors;
  };

  // Reconstruct path from cameFrom map
  const reconstructPath = (cameFrom, current) => {
    const path = [current];
    let currentKey = `${current.row}-${current.col}`;
    
    while (cameFrom[currentKey]) {
      current = cameFrom[currentKey];
      path.unshift(current);
      currentKey = `${current.row}-${current.col}`;
    }
    
    // Remove the first node since it's the start node
    path.shift();
    return path;
  };

  // Visualize the computed path
  const visualizePath = (pathArray) => {
    if (!pathArray.length) {
      alert('No path found!');
      return;
    }
    
    const newGrid = clearPath();
    
    // Mark path cells
    pathArray.forEach(node => {
      newGrid[node.row][node.col].isPath = true;
    });
    
    setPath(pathArray);
    setGrid(newGrid);
  };

  // Convert from internal grid coordinates to cartesian coordinates for display
  const toCartesianCoords = (row, col) => {
    // Convert row to y-coordinate (0 at bottom, increasing upwards)
    const y = (rows - 1) - row;
    // x-coordinate remains the same as column
    const x = col;
    return { x, y };
  };

  // Display position in cartesian coordinates
  const displayPosition = (position) => {
    if (!position) return '- Not Set';
    const { x, y } = toCartesianCoords(position.row, position.col);
    return `at (${x}, ${y})`;
  };

  return (
    <div className="home-container">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="navbar-logo">
          <h2>Playground</h2>
        </div>
        <nav className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/pathfinding" className="nav-link active">Pathfinding</Link>
          <Link to="/game-theory" className="nav-link">Game Theory</Link>
        </nav>
      </header>

      <div className="pathfinding-container">
        <h1>Pathfinding Algorithms</h1>

        <div className="controls-container">
          <div className="tool-selection">
            <h3>Select Mode:</h3>
            <div className="controls-group">
              <button 
                className={`control-btn ${cellType === 'robot' ? 'active' : ''}`} 
                onClick={() => setCellType('robot')}
              >
                Place Robot
              </button>
              <button 
                className={`control-btn ${cellType === 'destination' ? 'active' : ''}`}
                onClick={() => setCellType('destination')}
              >
                Set Destination
              </button>
              <button 
                className={`control-btn ${cellType === 'wall' ? 'active' : ''}`}
                onClick={() => setCellType('wall')}
              >
                Toggle Walls
              </button>
            </div>
          </div>

          <div className="execution-controls">
            <button 
              className="compute-btn" 
              onClick={computePath}
              disabled={!robotPos || !destPos || isComputing}
            >
              {isComputing ? 'Computing...' : 'Find Path (A*)'}
            </button>
            <button className="reset-btn" onClick={resetGrid}>
              Reset Grid
            </button>
          </div>

          <div className="status-info">
            <div className="status-item">
              <div className="status-color robot"></div>
              <span>Robot {displayPosition(robotPos)}</span>
            </div>
            <div className="status-item">
              <div className="status-color destination"></div>
              <span>Destination {displayPosition(destPos)}</span>
            </div>
            <div className="status-item">
              <div className="status-color wall"></div>
              <span>Wall</span>
            </div>
            <div className="status-item">
              <div className="status-color path"></div>
              <span>Path - {path.length} steps</span>
            </div>
          </div>
        </div>

        <div className="grid-container">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="grid-row">
              {row.map((cell, colIdx) => {
                // Convert to cartesian coordinates for display
                const { x, y } = toCartesianCoords(rowIdx, colIdx);
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`grid-cell ${cell.isRobot ? 'robot' : ''} ${
                      cell.isDestination ? 'destination' : ''} ${
                      cell.isWall ? 'wall' : ''} ${
                      cell.isPath ? 'path' : ''}`
                    }
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                  >
                    <span className="cell-coord">{`${x},${y}`}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pathfinding;
