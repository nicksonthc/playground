import React, { useState, useEffect } from 'react';
import './Home.css'; // For navbar styling
import './components/Pathfinding/PathfindingPage.css'; // For grid styling
import Navbar from './components/Navbar';

function Pathfinding() {
  // Topic selection state
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  // Pathfinding topics configuration
  const pathfindingTopics = [
    // ===== IMPLEMENTED TOPICS (with full demo components) =====
    {
      id: 'basic-astar',
      title: 'Basic A* Pathfinding',
      description: 'Single agent pathfinding with step-by-step visualization',
      icon: 'fas fa-route',
      color: '#ff6b6b',
      difficulty: 'Beginner',
      status: 'available'
    },
    {
      id: 'pick-drop',
      title: 'Pick & Drop Multi-Target',
      description: 'Agent picks up item and delivers to multiple destinations',
      icon: 'fas fa-boxes',
      color: '#4ecdc4',
      difficulty: 'Intermediate',
      status: 'available'
    },
    {
      id: 'disconnected-regions',
      title: 'Disconnected Regions',
      description: 'Navigate when direct path is blocked by disconnected areas',
      icon: 'fas fa-puzzle-piece',
      color: '#45b7d1',
      difficulty: 'Intermediate',
      status: 'available'
    },
    {
      id: 'time-factor',
      title: 'Time-Factor Pathfinding',
      description: 'Navigate with temporal constraints where each step has time costs',
      icon: 'fas fa-clock',
      color: '#8b5cf6',
      difficulty: 'Advanced',
      status: 'available'
    },
    {
      id: 'multi-agent-dependency',
      title: 'Multi-Agent Dependencies',
      description: 'Coordinate multiple agents with pickup/drop dependencies',
      icon: 'fas fa-project-diagram',
      color: '#06b6d4',
      difficulty: 'Expert',
      status: 'available'
    },

    // ===== PLANNED TOPICS (coming soon) =====
    {
      id: 'weighted-terrain',
      title: 'Weighted Terrain',
      description: 'Different terrain costs and optimal path selection',
      icon: 'fas fa-mountain',
      color: '#00b894',
      difficulty: 'Intermediate',
      status: 'coming-soon'
    },
    {
      id: 'narrow-corridor',
      title: 'Narrow Corridor Problem',
      description: 'Multiple agents navigating through bottlenecks',
      icon: 'fas fa-compress-arrows-alt',
      color: '#f9ca24',
      difficulty: 'Advanced',
      status: 'coming-soon'
    },
    {
      id: 'multi-agent',
      title: 'Multi-Agent Cooperation',
      description: 'Coordinated pathfinding with collision avoidance',
      icon: 'fas fa-users',
      color: '#6c5ce7',
      difficulty: 'Advanced',
      status: 'coming-soon'
    },
    {
      id: 'dynamic-obstacles',
      title: 'Dynamic Obstacles',
      description: 'Real-time replanning with moving obstacles',
      icon: 'fas fa-sync-alt',
      color: '#fd79a8',
      difficulty: 'Advanced',
      status: 'coming-soon'
    },
    {
      id: 'any-angle',
      title: 'Any-Angle Pathfinding',
      description: 'Theta* algorithm for smooth, realistic movement',
      icon: 'fas fa-bezier-curve',
      color: '#a29bfe',
      difficulty: 'Advanced',
      status: 'coming-soon'
    },
    {
      id: 'hierarchical',
      title: 'Hierarchical Pathfinding',
      description: 'HPA* for large-scale efficient pathfinding',
      icon: 'fas fa-sitemap',
      color: '#e17055',
      difficulty: 'Expert',
      status: 'coming-soon'
    },
    {
      id: 'algorithm-comparison',
      title: 'Algorithm Comparison',
      description: 'Side-by-side comparison of different pathfinding algorithms',
      icon: 'fas fa-chart-bar',
      color: '#fd7f28',
      difficulty: 'Educational',
      status: 'coming-soon'
    }
  ];
  
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

  // Time-Factor Pathfinding State
  const [timeGrid, setTimeGrid] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeConstraint, setTimeConstraint] = useState(20);

  // Multi-Agent Dependency State
  const [multiGrid, setMultiGrid] = useState([]);
  const [agents, setAgents] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [dropPoints, setDropPoints] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [placementMode, setPlacementMode] = useState('agent');

  // Acceleration Pathfinding State
  const [accelGrid, setAccelGrid] = useState([]);
  const [accelCellType, setAccelCellType] = useState('robot');
  const [robotAcceleration, setRobotAcceleration] = useState(0.5);
  const [maxSpeed, setMaxSpeed] = useState(2.0);
  const [friction, setFriction] = useState(0.1);
  const [physicsPath, setPhysicsPath] = useState([]);
  const [totalPhysicsTime, setTotalPhysicsTime] = useState(0);
  const [isPhysicsSimulating, setIsPhysicsSimulating] = useState(false);
  const [simulationElapsedTime, setSimulationElapsedTime] = useState(0);
  const [physicsBreakdown, setPhysicsBreakdown] = useState(null);

  // Initialize grid
  useEffect(() => {
    initializeGrid();
    initializeTimeGrid();
    initializeMultiGrid();

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

  // Initialize time grid with random time costs
  const initializeTimeGrid = () => {
    const newGrid = Array(rows).fill().map((_, rowIdx) =>
      Array(cols).fill().map((_, colIdx) => ({
        row: rowIdx,
        col: colIdx,
        isRobot: false,
        isDestination: false,
        isWall: false,
        isPath: false,
        timeCost: Math.floor(Math.random() * 5) + 1, // 1-5 time units
        visited: false,
        totalTime: Infinity
      }))
    );
    setTimeGrid(newGrid);
    setCurrentTime(0);
  };

  // Initialize multi-agent grid
  const initializeMultiGrid = () => {
    const newGrid = Array(rows).fill().map((_, rowIdx) =>
      Array(cols).fill().map((_, colIdx) => ({
        row: rowIdx,
        col: colIdx,
        isWall: false,
        occupiedBy: null, // agent id
        isPickup: false,
        isDrop: false,
        isPath: false
      }))
    );
    setMultiGrid(newGrid);
    setAgents([]);
    setPickupPoints([]);
    setDropPoints([]);
    setDependencies([]);
    setCurrentStep(0);
  };


  // Topic selection handlers
  const handleTopicSelect = (topicId) => {
    const topic = pathfindingTopics.find(t => t.id === topicId);
    if (topic.status === 'available') {
      setSelectedTopic(topicId);
      // Reset grid state when switching topics
      initializeGrid();
    }
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    initializeGrid();
    initializeTimeGrid();
    initializeMultiGrid();
  };

  // Time-aware A* algorithm
  const timeAwareAStar = (start, end, maxTime) => {
    const openSet = [{pos: start, time: 0, gScore: 0}];
    const closedSet = new Set();
    const cameFrom = {};
    const gScore = {};
    const fScore = {};
    
    // Initialize scores
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
      // Find node with lowest fScore
      let current = openSet.reduce((min, node) => 
        fScore[`${node.pos.row}-${node.pos.col}`] < fScore[`${min.pos.row}-${min.pos.col}`] ? node : min
      );
      
      const currentKey = `${current.pos.row}-${current.pos.col}`;
      
      // Check if we reached destination within time
      if (current.pos.row === end.row && current.pos.col === end.col) {
        return {
          path: reconstructTimePath(cameFrom, current.pos),
          totalTime: current.time
        };
      }
      
      // Remove current from openSet
      openSet.splice(openSet.indexOf(current), 1);
      closedSet.add(currentKey);
      
      // Check neighbors
      const neighbors = getNeighbors(current.pos);
      
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row}-${neighbor.col}`;
        
        if (closedSet.has(neighborKey) || timeGrid[neighbor.row][neighbor.col].isWall) {
          continue;
        }
        
        const moveCost = timeGrid[neighbor.row][neighbor.col].timeCost;
        const tentativeTime = current.time + moveCost;
        
        // Skip if this path exceeds time constraint
        if (tentativeTime > maxTime) {
          continue;
        }
        
        const tentativeGScore = gScore[currentKey] + moveCost;
        
        if (tentativeGScore < gScore[neighborKey]) {
          cameFrom[neighborKey] = current.pos;
          gScore[neighborKey] = tentativeGScore;
          fScore[neighborKey] = gScore[neighborKey] + heuristic(neighbor, end);
          
          // Add to openSet if not already there
          if (!openSet.find(node => node.pos.row === neighbor.row && node.pos.col === neighbor.col)) {
            openSet.push({pos: neighbor, time: tentativeTime, gScore: tentativeGScore});
          }
        }
      }
    }
    
    return {path: [], totalTime: Infinity};
  };

  const reconstructTimePath = (cameFrom, current) => {
    const path = [current];
    let currentKey = `${current.row}-${current.col}`;
    
    while (cameFrom[currentKey]) {
      current = cameFrom[currentKey];
      path.unshift(current);
      currentKey = `${current.row}-${current.col}`;
    }
    
    path.shift(); // Remove start position
    return path;
  };

  const computeTimeAwarePath = () => {
    if (!robotPos || !destPos) {
      alert('Please select both a robot position and a destination');
      return;
    }

    setIsComputing(true);
    setTimeout(() => {
      const result = timeAwareAStar(robotPos, destPos, timeConstraint);
      if (result.path.length > 0 && result.totalTime <= timeConstraint) {
        visualizeTimePath(result);
      } else {
        alert(`No path found within time constraint of ${timeConstraint} units!`);
      }
      setIsComputing(false);
    }, 100);
  };

  const visualizeTimePath = (result) => {
    const newGrid = [...timeGrid];
    
    // Clear previous path
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        newGrid[i][j].isPath = false;
      }
    }
    
    // Mark new path
    result.path.forEach(node => {
      newGrid[node.row][node.col].isPath = true;
    });
    
    setTimeGrid(newGrid);
    setCurrentTime(result.totalTime);
  };

  const handleTimeCellClick = (row, col) => {
    if (isComputing) return;

    const newGrid = [...timeGrid];
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
      cell.isWall = !cell.isWall;
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

    // Clear previous path
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        newGrid[i][j].isPath = false;
      }
    }
    
    setTimeGrid(newGrid);
    setCurrentTime(0);
  };

  // Multi-agent functions
  const handleMultiCellClick = (row, col) => {
    if (simulationRunning) return;

    const newGrid = [...multiGrid];
    const cell = newGrid[row][col];

    if (cell.isWall) return; // Can't place on walls

    if (placementMode === 'agent') {
      // Add new agent
      const agentId = `agent-${agents.length + 1}`;
      const newAgent = {
        id: agentId,
        position: { row, col },
        target: null,
        carrying: null,
        path: [],
        status: 'idle'
      };
      setAgents([...agents, newAgent]);
      cell.occupiedBy = agentId;
    } else if (placementMode === 'pickup') {
      const pickupId = `pickup-${pickupPoints.length + 1}`;
      const newPickup = {
        id: pickupId,
        position: { row, col },
        item: `Item-${pickupPoints.length + 1}`,
        pickedUp: false
      };
      setPickupPoints([...pickupPoints, newPickup]);
      cell.isPickup = true;
    } else if (placementMode === 'drop') {
      const dropId = `drop-${dropPoints.length + 1}`;
      const newDrop = {
        id: dropId,
        position: { row, col },
        requiredItem: null
      };
      setDropPoints([...dropPoints, newDrop]);
      cell.isDrop = true;
    } else if (placementMode === 'wall') {
      cell.isWall = !cell.isWall;
      if (cell.isWall) {
        // Clear any occupants
        cell.occupiedBy = null;
        cell.isPickup = false;
        cell.isDrop = false;
      }
    }

    setMultiGrid(newGrid);
  };

  const createDependency = () => {
    if (pickupPoints.length > 0 && dropPoints.length > 0) {
      const availablePickups = pickupPoints.filter(p => 
        !dependencies.some(d => d.pickupId === p.id)
      );
      const availableDrops = dropPoints.filter(d => 
        !dependencies.some(dep => dep.dropId === d.id)
      );

      if (availablePickups.length > 0 && availableDrops.length > 0) {
        const pickup = availablePickups[0];
        const drop = availableDrops[0];
        
        const newDependency = {
          id: `dep-${dependencies.length + 1}`,
          pickupId: pickup.id,
          dropId: drop.id,
          item: pickup.item,
          completed: false
        };

        setDependencies([...dependencies, newDependency]);
        
        // Update drop point to require this item
        const updatedDrops = dropPoints.map(d => 
          d.id === drop.id ? { ...d, requiredItem: pickup.item } : d
        );
        setDropPoints(updatedDrops);
      }
    }
  };

  const runMultiAgentSimulation = () => {
    if (agents.length === 0 || dependencies.length === 0) {
      alert('Please add agents and create dependencies first!');
      return;
    }

    setSimulationRunning(true);
    setCurrentStep(0);
    
    // Assign initial tasks to agents
    const updatedAgents = [...agents];
    const availableDependencies = dependencies.filter(d => !d.completed);
    
    updatedAgents.forEach((agent, index) => {
      if (index < availableDependencies.length) {
        const dep = availableDependencies[index];
        const pickup = pickupPoints.find(p => p.id === dep.pickupId);
        agent.target = pickup.position;
        agent.status = 'moving_to_pickup';
        agent.assignedDependency = dep.id;
      }
    });

    setAgents(updatedAgents);
    simulateStep(updatedAgents, 0);
  };

  const simulateStep = (currentAgents, step) => {
    if (step > 100) { // Safety limit
      setSimulationRunning(false);
      return;
    }

    const updatedAgents = [...currentAgents];
    const newGrid = [...multiGrid];
    let allCompleted = true;

    // Clear previous positions
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (newGrid[i][j].occupiedBy && newGrid[i][j].occupiedBy.startsWith('agent-')) {
          newGrid[i][j].occupiedBy = null;
        }
      }
    }

    updatedAgents.forEach(agent => {
      if (agent.status !== 'completed') {
        allCompleted = false;
        
        // Simple pathfinding to target
        if (agent.target) {
          const nextPos = getNextMoveToTarget(agent.position, agent.target, newGrid);
          
          if (nextPos) {
            agent.position = nextPos;
            newGrid[nextPos.row][nextPos.col].occupiedBy = agent.id;
            
            // Check if reached target
            if (nextPos.row === agent.target.row && nextPos.col === agent.target.col) {
              if (agent.status === 'moving_to_pickup') {
                // Pick up item
                const dep = dependencies.find(d => d.id === agent.assignedDependency);
                const pickup = pickupPoints.find(p => p.id === dep.pickupId);
                agent.carrying = pickup.item;
                agent.status = 'moving_to_drop';
                
                // Set target to drop point
                const drop = dropPoints.find(d => d.id === dep.dropId);
                agent.target = drop.position;
                
                // Mark pickup as picked up
                const updatedPickups = pickupPoints.map(p => 
                  p.id === pickup.id ? { ...p, pickedUp: true } : p
                );
                setPickupPoints(updatedPickups);
                
              } else if (agent.status === 'moving_to_drop') {
                // Drop item
                agent.carrying = null;
                agent.status = 'completed';
                agent.target = null;
                
                // Mark dependency as completed
                const updatedDeps = dependencies.map(d => 
                  d.id === agent.assignedDependency ? { ...d, completed: true } : d
                );
                setDependencies(updatedDeps);
              }
            }
          }
        }
      } else {
        // Agent is completed, just mark position
        newGrid[agent.position.row][agent.position.col].occupiedBy = agent.id;
      }
    });

    setMultiGrid(newGrid);
    setAgents(updatedAgents);
    setCurrentStep(step);

    if (!allCompleted && simulationRunning) {
      setTimeout(() => simulateStep(updatedAgents, step + 1), 500);
    } else {
      setSimulationRunning(false);
      if (allCompleted) {
        alert('All dependencies completed successfully!');
      }
    }
  };

  const getNextMoveToTarget = (current, target, grid) => {
    const neighbors = getNeighbors(current);
    
    // Filter out walls and occupied cells
    const validNeighbors = neighbors.filter(neighbor => 
      !grid[neighbor.row][neighbor.col].isWall &&
      !grid[neighbor.row][neighbor.col].occupiedBy
    );
    
    if (validNeighbors.length === 0) return null;
    
    // Choose neighbor closest to target (Manhattan distance)
    return validNeighbors.reduce((best, neighbor) => {
      const neighborDist = Math.abs(neighbor.row - target.row) + Math.abs(neighbor.col - target.col);
      const bestDist = Math.abs(best.row - target.row) + Math.abs(best.col - target.col);
      return neighborDist < bestDist ? neighbor : best;
    });
  };

  // Physics-based pathfinding functions
  const handleAccelCellClick = (row, col) => {
    if (isPhysicsSimulating) return;

    const newGrid = [...accelGrid];
    const cell = newGrid[row][col];

    if (accelCellType === 'robot') {
      // Clear previous robot position
      if (robotPos) {
        newGrid[robotPos.row][robotPos.col].isRobot = false;
      }
      cell.isRobot = true;
      setRobotPos({ row, col });
     
    } else if (accelCellType === 'destination') {
      // Clear previous destination
      if (destPos) {
        newGrid[destPos.row][destPos.col].isDestination = false;
      }
      cell.isDestination = true;
      setDestPos({ row, col });
    } else if (accelCellType === 'wall') {
      cell.isWall = !cell.isWall;
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

    // Clear previous path
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        newGrid[i][j].isPath = false;
      }
    }
    
    setAccelGrid(newGrid);
    setPhysicsPath([]);
    setTotalPhysicsTime(0);
    setPhysicsBreakdown(null);
  };

  const computePhysicsPath = () => {
    if (!robotPos || !destPos) {
      alert('Please select both a robot position and a destination');
      return;
    }

    setIsPhysicsSimulating(true);
    setIsComputing(true);
    setSimulationElapsedTime(0);
    
    // Start elapsed time tracking
    const startTime = Date.now();
    const updateElapsedTime = () => {
      if (isPhysicsSimulating) {
        setSimulationElapsedTime((Date.now() - startTime) / 1000);
        requestAnimationFrame(updateElapsedTime);
      }
    };
    requestAnimationFrame(updateElapsedTime);
    
    // Convert discrete positions to continuous coordinates
    const startPos = { x: robotPos.col + 0.5, y: robotPos.row + 0.5 };
    const targetPos = { x: destPos.col + 0.5, y: destPos.row + 0.5 };
    
    // Run physics simulation in next tick to allow UI to update
    setTimeout(() => {
      const result = simulatePhysicsMovement(startPos, targetPos);
      visualizePhysicsPath(result);
      // Store the physics breakdown for UI display
      if (result.breakdown) {
        setPhysicsBreakdown(result.breakdown);
      }
      setIsPhysicsSimulating(false);
      setIsComputing(false);
    }, 10);
  };

  const simulatePhysicsMovement = (start, target) => {
    // Step 1: Use proper A* pathfinding
    const startGrid = { row: Math.floor(start.y), col: Math.floor(start.x) };
    const targetGrid = { row: Math.floor(target.y), col: Math.floor(target.x) };
    
    console.log('A* pathfinding from:', startGrid, 'to:', targetGrid);
    
    // Use proper A* algorithm to avoid walls
    const astarPath = findAStarPath(startGrid, targetGrid);
    
    if (!astarPath || astarPath.length === 0) {
      console.log('No path found - destination unreachable!');
      return { success: false, path: [], totalTime: 0 };
    }
    
    console.log('A* path found:', astarPath);
    console.log('Total steps needed:', astarPath.length - 1);
    
    // Step 2: Simulate step-by-step movement with acceleration/deceleration
    return simulateStepByStepMovement(astarPath);
  };

  const findAStarPath = (start, end) => {
    console.log('Starting A* pathfinding...');
    console.log('Start:', start, 'End:', end);
    
    // Validate positions
    if (start.row < 0 || start.row >= rows || start.col < 0 || start.col >= cols ||
        end.row < 0 || end.row >= rows || end.col < 0 || end.col >= cols) {
      console.log('Invalid start or end position');
      return [];
    }
    
    // Check if start or end is a wall
    if (accelGrid[start.row][start.col].isWall || accelGrid[end.row][end.col].isWall) {
      console.log('Start or end position is a wall');
      return [];
    }
    
    // A* implementation
    const openSet = [];
    const closedSet = [];
    const gScore = {};
    const fScore = {};
    const cameFrom = {};
    
    // Initialize scores
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const key = `${i}-${j}`;
        gScore[key] = Infinity;
        fScore[key] = Infinity;
      }
    }
    
    const startKey = `${start.row}-${start.col}`;
    gScore[startKey] = 0;
    fScore[startKey] = manhattanDistance(start, end);
    
    openSet.push(start);
    
    while (openSet.length > 0) {
      // Find node with lowest fScore
      let current = openSet[0];
      let currentIndex = 0;
      
      for (let i = 1; i < openSet.length; i++) {
        const currentKey = `${current.row}-${current.col}`;
        const nodeKey = `${openSet[i].row}-${openSet[i].col}`;
        if (fScore[nodeKey] < fScore[currentKey]) {
          current = openSet[i];
          currentIndex = i;
        }
      }
      
      // Found the goal
      if (current.row === end.row && current.col === end.col) {
        console.log('A* path found! Reconstructing...');
        return reconstructPath(cameFrom, current);
      }
      
      // Move current from open to closed set
      openSet.splice(currentIndex, 1);
      closedSet.push(current);
      
      // Check all 4 neighbors (Manhattan directions)
      const neighbors = [
        { row: current.row - 1, col: current.col }, // Up
        { row: current.row + 1, col: current.col }, // Down
        { row: current.row, col: current.col - 1 }, // Left
        { row: current.row, col: current.col + 1 }  // Right
      ];
      
      for (const neighbor of neighbors) {
        // Skip if out of bounds
        if (neighbor.row < 0 || neighbor.row >= rows || 
            neighbor.col < 0 || neighbor.col >= cols) {
          continue;
        }
        
        // Skip if wall
        if (accelGrid[neighbor.row][neighbor.col].isWall) {
          continue;
        }
        
        // Skip if in closed set
        if (closedSet.some(node => node.row === neighbor.row && node.col === neighbor.col)) {
          continue;
        }
        
        const currentKey = `${current.row}-${current.col}`;
        const neighborKey = `${neighbor.row}-${neighbor.col}`;
        const tentativeGScore = gScore[currentKey] + 1;
        
        // If this path to neighbor is better
        if (tentativeGScore < gScore[neighborKey]) {
          cameFrom[neighborKey] = current;
          gScore[neighborKey] = tentativeGScore;
          fScore[neighborKey] = gScore[neighborKey] + manhattanDistance(neighbor, end);
          
          // Add to open set if not already there
          if (!openSet.some(node => node.row === neighbor.row && node.col === neighbor.col)) {
            openSet.push(neighbor);
          }
        }
      }
    }
    
    console.log('No path found!');
    return [];
  };

  const manhattanDistance = (a, b) => {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  };

  // const reconstructPath = (cameFrom, current) => {
  //   const path = [current];
    
  //   let node = current;
  //   while (cameFrom[`${node.row}-${node.col}`]) {
  //     node = cameFrom[`${node.row}-${node.col}`];
  //     path.unshift(node);
  //   }
    
  //   console.log('Reconstructed A* path with', path.length, 'steps');
  //   console.log('Path:', path);
  //   return path;
  // };

  const simulateStepByStepMovement = (manhattanPath) => {
    console.log('=== PHYSICS CALCULATION ===');
    console.log('Manhattan path points:', manhattanPath.length);
    
    const totalDistance = manhattanPath.length - 1; // Number of unit moves
    console.log('Total distance:', totalDistance, 'units');
    console.log('Acceleration:', robotAcceleration, 'units/s²');
    console.log('Max speed:', maxSpeed, 'units/s');
    
    // Calculate physics phases
    const timeToMaxSpeed = maxSpeed / robotAcceleration;
    const distanceToMaxSpeed = 0.5 * robotAcceleration * timeToMaxSpeed * timeToMaxSpeed;
    
    console.log('Time to reach max speed:', timeToMaxSpeed.toFixed(2), 'seconds');
    console.log('Distance to reach max speed:', distanceToMaxSpeed.toFixed(2), 'units');
    
    let accelerationTime, constantSpeedTime, decelerationTime;
    let accelerationDistance, constantSpeedDistance, decelerationDistance;
    
    if (totalDistance <= 2 * distanceToMaxSpeed) {
      // Short distance - never reaches max speed
      // Accelerate to middle, then decelerate
      const halfDistance = totalDistance / 2;
      accelerationTime = Math.sqrt(2 * halfDistance / robotAcceleration);
      accelerationDistance = halfDistance;
      constantSpeedTime = 0;
      constantSpeedDistance = 0;
      decelerationTime = accelerationTime;
      decelerationDistance = halfDistance;
      
      console.log('SHORT PATH: Never reaches max speed');
    } else {
      // Long distance - reaches max speed
      accelerationTime = timeToMaxSpeed;
      accelerationDistance = distanceToMaxSpeed;
      decelerationTime = timeToMaxSpeed;
      decelerationDistance = distanceToMaxSpeed;
      constantSpeedDistance = totalDistance - accelerationDistance - decelerationDistance;
      constantSpeedTime = constantSpeedDistance / maxSpeed;
      
      console.log('LONG PATH: Reaches max speed');
    }
    
    const totalTime = accelerationTime + constantSpeedTime + decelerationTime;
    
    console.log('=== PHASE BREAKDOWN ===');
    console.log('Phase 1 - Acceleration:', accelerationTime.toFixed(2), 's, Distance:', accelerationDistance.toFixed(2), 'units');
    console.log('Phase 2 - Constant Speed:', constantSpeedTime.toFixed(2), 's, Distance:', constantSpeedDistance.toFixed(2), 'units');
    console.log('Phase 3 - Deceleration:', decelerationTime.toFixed(2), 's, Distance:', decelerationDistance.toFixed(2), 'units');
    console.log('TOTAL TIME:', totalTime.toFixed(2), 'seconds');
    
    // Create breakdown object for UI display
    const breakdown = {
      totalDistance,
      acceleration: robotAcceleration,
      maxSpeed,
      timeToMaxSpeed,
      distanceToMaxSpeed,
      isLongPath: totalDistance > 2 * distanceToMaxSpeed,
      phases: {
        acceleration: { time: accelerationTime, distance: accelerationDistance },
        constantSpeed: { time: constantSpeedTime, distance: constantSpeedDistance },
        deceleration: { time: decelerationTime, distance: decelerationDistance }
      },
      totalTime
    };
    
    // Generate path points
    const path = [];
    const startPoint = manhattanPath[0];
    const endPoint = manhattanPath[manhattanPath.length - 1];
    
    // Calculate direction vector
    const dirX = endPoint.col - startPoint.col;
    const dirY = endPoint.row - startPoint.row;
    const magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
    const unitDirX = dirX / magnitude;
    const unitDirY = dirY / magnitude;
    
    const dt = 0.1; // Time step for path generation
    let currentTime = 0;

    
    while (currentTime <= totalTime) {
      let speed, distance;
      
      if (currentTime <= accelerationTime) {
        // Acceleration phase
        speed = robotAcceleration * currentTime;
        distance = 0.5 * robotAcceleration * currentTime * currentTime;
      } else if (currentTime <= accelerationTime + constantSpeedTime) {
        // Constant speed phase
        speed = maxSpeed;
        const timeInConstant = currentTime - accelerationTime;
        distance = accelerationDistance + maxSpeed * timeInConstant;
      } else {
        // Deceleration phase
        const timeInDecel = currentTime - accelerationTime - constantSpeedTime;
        const remainingDecelTime = decelerationTime - timeInDecel;
        speed = robotAcceleration * remainingDecelTime;
        distance = accelerationDistance + constantSpeedDistance + 
                  (decelerationDistance - 0.5 * robotAcceleration * remainingDecelTime * remainingDecelTime);
      }
      
      // Calculate position
      const x = startPoint.col + 0.5 + unitDirX * distance;
      const y = startPoint.row + 0.5 + unitDirY * distance;
      
      path.push({
        x: x,
        y: y,
        time: currentTime,
        vx: unitDirX * speed,
        vy: unitDirY * speed,
        speed: speed
      });
      
      currentTime += dt;
    }
    
    // Ensure final position is exact
    path.push({
      x: endPoint.col + 0.5,
      y: endPoint.row + 0.5,
      time: totalTime,
      vx: 0,
      vy: 0,
      speed: 0
    });
    
    console.log('Generated', path.length, 'path points');
    return { success: true, path, totalTime, breakdown };
  };

  const visualizePhysicsPath = (result) => {
    const newGrid = [...accelGrid];
    
    // Clear previous path
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        newGrid[i][j].isPath = false;
      }
    }
    
    // Mark cells that the path passes through
    result.path.forEach(point => {
      const gridX = Math.floor(point.x);
      const gridY = Math.floor(point.y);
      if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
        newGrid[gridY][gridX].isPath = true;
      }
    });
    
    setAccelGrid(newGrid);
    setPhysicsPath(result.path);
    setTotalPhysicsTime(result.totalTime);
  };

  return (
    <div className="home-container">
      <Navbar />
      
      {!selectedTopic ? (
        // Topic Selection View
        <div className="main-content">
          <section className="pathfinding-section">
            <div className="section-header">
              <h1>Pathfinding Algorithms</h1>
              <p>Master the art of pathfinding through interactive visualizations and hands-on implementations</p>
              <div className="scope-info">
                <div className="scope-badge">
                  <i className="fas fa-compass"></i>
                  <span>Manhattan Distance</span>
                </div>
                <p className="scope-description">
                  All pathfinding algorithms use 4-directional movement (↑↓←→) with Manhattan distance heuristic for realistic grid-based navigation
                </p>
              </div>
            </div>
            
            <div className="topics-grid">
              {pathfindingTopics.map((topic, index) => (
                <div 
                  key={topic.id} 
                  className={`topic-card ${topic.status === 'coming-soon' ? 'disabled' : ''}`}
                  onClick={() => handleTopicSelect(topic.id)}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="card-header">
                    <div className="card-icon" style={{backgroundColor: topic.color}}>
                      <i className={topic.icon}></i>
                    </div>
                    <div className="card-meta">
                      <span className={`difficulty-badge ${topic.difficulty.toLowerCase()}`}>
                        {topic.difficulty}
                      </span>
                      {topic.status === 'coming-soon' && (
                        <span className="status-badge">Coming Soon</span>
                      )}
                    </div>
                  </div>
                  <div className="card-content">
                    <h3>{topic.title}</h3>
                    <p>{topic.description}</p>
                  </div>
                  <div className="card-footer">
                    {topic.status === 'available' ? (
                      <span className="explore-text">
                        <span>Explore</span>
                        <i className="fas fa-arrow-right"></i>
                      </span>
                    ) : (
                      <span className="coming-soon-text">
                        <i className="fas fa-clock"></i>
                        <span>Coming Soon</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        // Selected Topic Implementation View
        <div className="pathfinding-container">
          <div className="topic-header">
            <button className="back-button" onClick={handleBackToTopics}>
              <i className="fas fa-arrow-left"></i>
              Back to Topics
            </button>
            <h1>{pathfindingTopics.find(t => t.id === selectedTopic)?.title}</h1>
          </div>

          {renderTopicImplementation()}
        </div>
      )}
    </div>
  );

  // Render specific topic implementation
  function renderTopicImplementation() {
    switch (selectedTopic) {
      case 'basic-astar':
        return renderBasicAStar();
      case 'pick-drop':
        return renderPickDrop();
      case 'disconnected-regions':
        return renderDisconnectedRegions();
      case 'time-factor':
        return renderTimeFactor();
      case 'multi-agent-dependency':
        return renderMultiAgentDependency();
      
      default:
        return <div>Topic implementation coming soon...</div>;
    }
  }

  // Basic A* Implementation (Enhanced version of current)
  function renderBasicAStar() {
    return (
      <>
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
      </>
    );
  }

  // Pick & Drop Implementation
  function renderPickDrop() {
    return (
      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <i className="fas fa-boxes coming-soon-icon"></i>
          <h3>Pick & Drop Multi-Target</h3>
          <p>This advanced pathfinding scenario is coming soon!</p>
          <p>Will feature multi-waypoint pathfinding with pickup and delivery optimization.</p>
        </div>
      </div>
    );
  }

  // Disconnected Regions Implementation  
  function renderDisconnectedRegions() {
    return (
      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <i className="fas fa-puzzle-piece coming-soon-icon"></i>
          <h3>Disconnected Regions Problem</h3>
          <p>This challenging pathfinding scenario is coming soon!</p>
          <p>Will demonstrate navigation when direct paths are blocked by disconnected areas.</p>
        </div>
      </div>
    );
  }

  // Time-Factor Pathfinding Implementation
  function renderTimeFactor() {
    return (
      <>
        <div className="time-factor-info">
          <div className="time-info-card">
            <h3>Temporal Pathfinding</h3>
            <p>Each cell has a time cost (1-5 units). Find the optimal path within the time constraint using Manhattan distance heuristic.</p>
          </div>
        </div>

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
            <div className="time-constraint-control">
              <label>Time Constraint: {timeConstraint} units</label>
              <input 
                type="range" 
                min="10" 
                max="50" 
                value={timeConstraint}
                onChange={(e) => setTimeConstraint(parseInt(e.target.value))}
                className="time-slider"
              />
            </div>
            <button 
              className="compute-btn" 
              onClick={computeTimeAwarePath}
              disabled={!robotPos || !destPos || isComputing}
            >
              {isComputing ? 'Computing...' : 'Find Time-Optimal Path'}
            </button>
            <button className="reset-btn" onClick={initializeTimeGrid}>
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
              <div className="status-color path"></div>
              <span>Path Time: {currentTime} / {timeConstraint} units</span>
            </div>
          </div>
        </div>

        <div className="grid-container">
          {timeGrid.map((row, rowIdx) => (
            <div key={rowIdx} className="grid-row">
              {row.map((cell, colIdx) => {
                const { x, y } = toCartesianCoords(rowIdx, colIdx);
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`grid-cell time-cell ${cell.isRobot ? 'robot' : ''} ${
                      cell.isDestination ? 'destination' : ''} ${
                      cell.isWall ? 'wall' : ''} ${
                      cell.isPath ? 'path' : ''}`
                    }
                    onClick={() => handleTimeCellClick(rowIdx, colIdx)}
                    style={{
                      backgroundColor: cell.isWall ? undefined : 
                        cell.isRobot || cell.isDestination || cell.isPath ? undefined :
                        `rgba(255, 255, 255, ${0.1 + (cell.timeCost / 5) * 0.3})`
                    }}
                  >
                    <span className="cell-coord">{`${x},${y}`}</span>
                    <span className="time-cost">{cell.isWall ? '' : cell.timeCost}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </>
    );
  }

  // Multi-Agent Dependency Implementation
  function renderMultiAgentDependency() {
    return (
      <>
        <div className="multi-agent-info">
          <div className="multi-info-card">
            <h3>Multi-Agent Coordination</h3>
            <p>Coordinate multiple agents to complete pickup and delivery tasks with dependencies. Agents use Manhattan distance pathfinding and avoid collisions.</p>
          </div>
        </div>

        <div className="controls-container">
          <div className="tool-selection">
            <h3>Placement Mode:</h3>
            <div className="controls-group">
              <button 
                className={`control-btn ${placementMode === 'agent' ? 'active' : ''}`} 
                onClick={() => setPlacementMode('agent')}
              >
                Add Agent
              </button>
              <button 
                className={`control-btn ${placementMode === 'pickup' ? 'active' : ''}`}
                onClick={() => setPlacementMode('pickup')}
              >
                Add Pickup
              </button>
              <button 
                className={`control-btn ${placementMode === 'drop' ? 'active' : ''}`}
                onClick={() => setPlacementMode('drop')}
              >
                Add Drop
              </button>
              <button 
                className={`control-btn ${placementMode === 'wall' ? 'active' : ''}`}
                onClick={() => setPlacementMode('wall')}
              >
                Toggle Walls
              </button>
            </div>
          </div>

          <div className="execution-controls">
            <button 
              className="dependency-btn" 
              onClick={createDependency}
              disabled={simulationRunning || pickupPoints.length === 0 || dropPoints.length === 0}
            >
              Create Dependency
            </button>
            <button 
              className="compute-btn" 
              onClick={runMultiAgentSimulation}
              disabled={simulationRunning || agents.length === 0 || dependencies.length === 0}
            >
              {simulationRunning ? 'Running...' : 'Start Simulation'}
            </button>
            <button className="reset-btn" onClick={initializeMultiGrid}>
              Reset All
            </button>
          </div>

          <div className="status-info">
            <div className="status-item">
              <div className="status-color agent"></div>
              <span>Agents: {agents.length}</span>
            </div>
            <div className="status-item">
              <div className="status-color pickup"></div>
              <span>Pickups: {pickupPoints.length}</span>
            </div>
            <div className="status-item">
              <div className="status-color drop"></div>
              <span>Drops: {dropPoints.length}</span>
            </div>
            <div className="status-item">
              <div className="status-color dependency"></div>
              <span>Dependencies: {dependencies.length}</span>
            </div>
            <div className="status-item">
              <span>Step: {currentStep}</span>
            </div>
          </div>
        </div>

        <div className="dependencies-list">
          <h4>Dependencies:</h4>
          {dependencies.map(dep => {
            const pickup = pickupPoints.find(p => p.id === dep.pickupId);
            return (
              <div key={dep.id} className={`dependency-item ${dep.completed ? 'completed' : ''}`}>
                <span>{pickup?.item || 'Unknown'} → Drop Point</span>
                {dep.completed && <i className="fas fa-check"></i>}
              </div>
            );
          })}
        </div>

        <div className="grid-container">
          {multiGrid.map((row, rowIdx) => (
            <div key={rowIdx} className="grid-row">
              {row.map((cell, colIdx) => {
                const { x, y } = toCartesianCoords(rowIdx, colIdx);
                const agent = agents.find(a => a.position.row === rowIdx && a.position.col === colIdx);
                const pickup = pickupPoints.find(p => p.position.row === rowIdx && p.position.col === colIdx);
                const drop = dropPoints.find(d => d.position.row === rowIdx && d.position.col === colIdx);
                
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`grid-cell multi-cell ${cell.isWall ? 'wall' : ''} ${
                      cell.occupiedBy ? 'agent' : ''} ${
                      cell.isPickup && !pickup?.pickedUp ? 'pickup' : ''} ${
                      cell.isDrop ? 'drop' : ''}`
                    }
                    onClick={() => handleMultiCellClick(rowIdx, colIdx)}
                  >
                    <span className="cell-coord">{`${x},${y}`}</span>
                    {agent && (
                      <div className="agent-info">
                        <span className="agent-id">{agent.id.split('-')[1]}</span>
                        {agent.carrying && <span className="carrying">📦</span>}
                      </div>
                    )}
                    {pickup && !pickup.pickedUp && (
                      <span className="pickup-item">📦</span>
                    )}
                    {drop && (
                      <span className="drop-zone">🎯</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </>
    );
  }


}

export default Pathfinding;
