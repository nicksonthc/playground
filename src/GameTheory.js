import React, { useState, useEffect } from 'react';
import './Home.css'; // For navbar styling
import './components/GameTheory/GameTheoryPage.css'; // CSS file

// Component imports
import GameSetupVisual from './components/GameTheory/GameSetupVisual';
import GameResultsVisual from './components/GameTheory/GameResultsVisual';
import GameHistoryChart from './components/GameTheory/GameHistoryChart';
import Navbar from './components/Navbar'; // Import the Navbar component

function GameTheory() {
  // Game state
  const [playerGuess, setPlayerGuess] = useState('');
  const [aiPlayers, setAiPlayers] = useState(5); // Number of AI players
  const [gameResults, setGameResults] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiStrategy, setAiStrategy] = useState('random'); // 'random', 'optimal', 'mixed'
  const [isPlayButtonDisabled, setIsPlayButtonDisabled] = useState(false);

  // Initialize game
  useEffect(() => {
    // Load previous games from localStorage if needed
    const savedHistory = localStorage.getItem('nashGameHistory');
    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    if (gameHistory.length > 0) {
      localStorage.setItem('nashGameHistory', JSON.stringify(gameHistory));
    }
  }, [gameHistory]);

  // Handle guess input change
  const handleGuessChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
      setPlayerGuess(value);
    }
  };

  // Generate AI guesses based on strategy
  const generateAiGuesses = () => {
    const guesses = [];
    
    for (let i = 0; i < aiPlayers; i++) {
      let guess;
      
      switch (aiStrategy) {
        case 'optimal':
          // In theory, the Nash equilibrium is 0, but we'll add some variance
          guess = Math.floor(Math.random() * 10); // 0-9
          break;
        
        case 'mixed':
          // Mixed strategy: some optimal, some naive, some in between
          const strategyType = Math.random();
          if (strategyType < 0.3) {
            // Near optimal
            guess = Math.floor(Math.random() * 15); // 0-14
          } else if (strategyType < 0.7) {
            // Intermediate reasoning (1-2 iterations of reasoning)
            guess = Math.floor(Math.random() * 30) + 20; // 20-49
          } else {
            // Naive (around 50-70)
            guess = Math.floor(Math.random() * 21) + 50; // 50-70
          }
          break;
        
        case 'random':
        default:
          // Completely random strategy
          guess = Math.floor(Math.random() * 101); // 0-100
          break;
      }
      
      guesses.push(guess);
    }
    
    return guesses;
  };

  // Calculate game results
  const calculateResults = (playerGuessNum, aiGuesses) => {
    // Combine all guesses
    const allGuesses = [...aiGuesses, playerGuessNum];
    
    // Calculate the average
    const sum = allGuesses.reduce((acc, guess) => acc + guess, 0);
    const average = sum / allGuesses.length;
    
    // Calculate target (2/3 of average)
    const targetNumber = (2/3) * average;
    
    // Find closest guess
    let closestDiff = Infinity;
    let winningGuess = null;
    let winners = [];
    
    allGuesses.forEach((guess) => {
      const diff = Math.abs(guess - targetNumber);
      if (diff < closestDiff) {
        closestDiff = diff;
        winningGuess = guess;
        winners = [guess === playerGuessNum ? 'You' : `AI Player ${aiGuesses.indexOf(guess) + 1}`];
      } else if (diff === closestDiff) {
        winners.push(guess === playerGuessNum ? 'You' : `AI Player ${aiGuesses.indexOf(guess) + 1}`);
      }
    });
    
    return {
      allGuesses,
      average,
      targetNumber,
      winningGuess,
      winners,
      playerWon: winners.includes('You')
    };
  };

  // Play the game
  const playGame = (e) => {
    e.preventDefault();
    
    if (playerGuess === '') {
      alert('Please enter a guess between 0 and 100');
      return;
    }
    
    setIsPlayButtonDisabled(true); // Disable the play button
    
    const playerGuessNum = parseInt(playerGuess);
    const aiGuesses = generateAiGuesses();
    
    const results = calculateResults(playerGuessNum, aiGuesses);
    setGameResults(results);
    
    // Add to history
    const historyItem = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      playerGuess: playerGuessNum,
      aiGuesses,
      ...results
    };
    
    setGameHistory(prev => [historyItem, ...prev].slice(0, 10)); // Keep only last 10 games
  };

  // Clear game history
  const clearHistory = () => {
    setGameHistory([]);
    localStorage.removeItem('nashGameHistory');
  };

  // Reset game
  const resetGame = () => {
    setGameResults(null);
    setPlayerGuess('');
    setIsPlayButtonDisabled(false); // Re-enable the play button
  };

  return (
    <div className="home-container">
      <Navbar /> {/* Use the Navbar component instead of inline JSX */}

      <div className="game-theory-container">
        <h1>Nash Equilibrium Guessing Game</h1>
        
        <div className="game-explanation">
          <h2>Game Rules</h2>
          <p>
            Enter a number between 0 and 100. The winning number will be 2/3 of the average 
            of all guesses (yours and AI players). The player whose guess is closest to this 
            target wins.
          </p>
          <button 
            className="explanation-btn"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            {showExplanation ? 'Hide Nash Equilibrium Explanation' : 'Show Nash Equilibrium Explanation'}
          </button>
          
          {showExplanation && (
            <div className="nash-explanation-card">
              <h3 className="card-title">Nash Equilibrium Analysis</h3>
              <div className="card-content">
                <p>
                  In this game, the Nash equilibrium is for everyone to choose 0. Here's why:
                </p>
                <ul className="explanation-list">
                  <li>If everyone picked randomly (average = 50), the target would be 33.</li>
                  <li>But rational players would then pick 33, making the target 22.</li>
                  <li>Knowing this, players would pick 22, making the target ~15.</li>
                  <li>This process of reasoning continues until reaching 0.</li>
                </ul>
                <p className="conclusion">
                  However, in reality, most players don't follow this reasoning all the way through,
                  making the actual optimal strategy somewhere between 0 and 33, depending on how 
                  sophisticated you think other players are.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Replace the game setup with the visual component */}
        <GameSetupVisual
          aiPlayers={aiPlayers}
          setAiPlayers={setAiPlayers}
          aiStrategy={aiStrategy}
          setAiStrategy={setAiStrategy}
          playerGuess={playerGuess}
          handleGuessChange={handleGuessChange}
          playGame={playGame}
          isPlayButtonDisabled={isPlayButtonDisabled}
        />

        {/* Replace the game results with the visual component */}
        {gameResults && (
          <GameResultsVisual
            results={gameResults}
            playerGuess={playerGuess}
            resetGame={resetGame}
          />
        )}

        {/* Add chart visualization for game history */}
        {gameHistory.length > 0 && (
          <div className="game-history-container">
            <div className="history-header">
              <h2>Game History</h2>
              <button onClick={clearHistory} className="clear-btn">Clear History</button>
            </div>
            
            <GameHistoryChart history={gameHistory} />
            
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Your Guess</th>
                  <th>Average</th>
                  <th>Target</th>
                  <th>Winner</th>
                </tr>
              </thead>
              <tbody>
                {gameHistory.map(game => (
                  <tr key={game.id}>
                    <td>{game.date}</td>
                    <td>{game.playerGuess}</td>
                    <td>{game.average.toFixed(2)}</td>
                    <td>{game.targetNumber.toFixed(2)}</td>
                    <td>{game.winners.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameTheory;
