import React from 'react';
import './GameTheoryComponents.css';

const GameResultsVisual = ({ results, playerGuess, resetGame }) => {
  const { allGuesses, average, targetNumber, winners, playerWon, winningGuess } = results;
  
  // Remove player's guess to get AI guesses only
  const aiGuesses = allGuesses.slice(0, -1);
  
  // Calculate the distribution of guesses for visualization
  const getGuessDistribution = () => {
    const distribution = Array(10).fill(0); // 10 buckets (0-10, 10-20, etc.)
    
    allGuesses.forEach(guess => {
      const bucket = Math.min(Math.floor(guess / 10), 9);
      distribution[bucket]++;
    });
    
    return distribution;
  };
  
  const guessDistribution = getGuessDistribution();
  const maxCount = Math.max(...guessDistribution);
  
  return (
    <div className="game-results card-container">
      <h2>Game Results</h2>
      
      <div className="results-visual">
        {/* Number line showing all guesses */}
        <div className="results-number-line">
          <div className="number-line-background"></div>
          
          {/* Mark player guess */}
          <div 
            className="guess-marker player" 
            style={{ left: `${parseInt(playerGuess)}%` }}
            title={`Your guess: ${playerGuess}`}
          >
            <div className="marker-label">You</div>
          </div>
          
          {/* Mark AI guesses */}
          {aiGuesses.map((guess, i) => (
            <div 
              key={i}
              className="guess-marker ai"
              style={{ left: `${guess}%` }}
              title={`AI ${i+1} guess: ${guess}`}
            >
              <div className="marker-label">{i+1}</div>
            </div>
          ))}
          
          {/* Target line */}
          <div
            className="target-line"
            style={{ left: `${targetNumber}%` }}
            title={`Target (2/3 of avg): ${targetNumber.toFixed(2)}`}
          >
            <div className="target-label">Target</div>
          </div>
          
          {/* Winning guess indicator */}
          <div
            className="winning-marker"
            style={{ left: `${winningGuess}%` }}
          >
            <div className="winning-label">Winner</div>
          </div>
          
          {/* Ticks */}
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(num => (
            <div key={num} className="result-tick" style={{ left: `${num}%` }}>
              <span>{num}</span>
            </div>
          ))}
        </div>
        
        {/* Distribution chart */}
        <div className="distribution-chart">
          <h3>Guess Distribution</h3>
          <div className="distribution-bars">
            {guessDistribution.map((count, i) => (
              <div key={i} className="distribution-bar-container">
                <div 
                  className="distribution-bar"
                  style={{ height: count > 0 ? `${(count / maxCount) * 100}%` : '0' }}
                >
                  {count > 0 && <span className="bar-value">{count}</span>}
                </div>
                <div className="bar-label">{`${i*10}-${i*10+9}`}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="results-details-visual">
        <div className="result-stat">
          <span className="stat-label">Your guess:</span>
          <span className="stat-value">{playerGuess}</span>
        </div>
        
        <div className="result-stat">
          <span className="stat-label">Average of all guesses:</span>
          <span className="stat-value">{average.toFixed(2)}</span>
        </div>
        
        <div className="result-stat">
          <span className="stat-label">Target (2/3 of average):</span>
          <span className="stat-value">{targetNumber.toFixed(2)}</span>
        </div>
        
        <div className="result-stat">
          <span className="stat-label">Closest guess:</span>
          <span className="stat-value">{winningGuess}</span>
        </div>
        
        <div className="result-stat">
          <span className="stat-label">Winner(s):</span>
          <span className="stat-value">{winners.join(', ')}</span>
        </div>
      </div>
      
      <div className={`winner-message ${playerWon ? 'player-won' : 'player-lost'}`}>
        {playerWon ? 'Congratulations! You won!' : 'Sorry, you lost this round.'}
      </div>
      
      <button onClick={resetGame} className="reset-btn">Play Again</button>
    </div>
  );
};

export default GameResultsVisual;
