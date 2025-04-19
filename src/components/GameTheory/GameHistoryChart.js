import React from 'react';
import './GameTheoryComponents.css'; // Updated relative path

const GameHistoryChart = ({ history }) => {
  // We'll show the last 10 games at most (or fewer if we don't have 10)
  const displayHistory = history.slice(0, 10).reverse();
  
  // Find the maximum value for scaling
  const maxValue = Math.max(
    100, // Fixed upper bound
    ...displayHistory.map(game => Math.max(game.average, game.targetNumber))
  );
  
  const calculatePosition = (value) => {
    return (value / maxValue) * 100;
  };
  
  return (
    <div className="game-history-chart">
      <h3>Your Performance Over Time</h3>
      
      <div className="chart-container">
        <div className="chart-y-axis">
          <span className="y-label top">100</span>
          <span className="y-label middle">50</span>
          <span className="y-label bottom">0</span>
        </div>
        
        <div className="chart-content">
          {/* Horizontal grid lines */}
          <div className="grid-line top"></div>
          <div className="grid-line middle"></div>
          <div className="grid-line bottom"></div>
          
          {/* Target line series */}
          <div className="chart-series target">
            {displayHistory.map((game, i) => (
              <div 
                key={`target-${i}`}
                className="chart-point target"
                style={{
                  left: `${(i / (displayHistory.length - 1 || 1)) * 100}%`,
                  bottom: `${calculatePosition(game.targetNumber)}%`
                }}
                title={`Target: ${game.targetNumber.toFixed(2)}`}
              ></div>
            ))}
            {displayHistory.length > 1 && (
              <svg className="line-svg target">
                <polyline
                  points={displayHistory
                    .map((game, i) => `${(i / (displayHistory.length - 1)) * 100},${100 - calculatePosition(game.targetNumber)}`)
                    .join(' ')}
                />
              </svg>
            )}
          </div>
          
          {/* Player guesses series */}
          <div className="chart-series player">
            {displayHistory.map((game, i) => (
              <div 
                key={`player-${i}`}
                className={`chart-point player ${game.playerWon ? 'winner' : ''}`}
                style={{
                  left: `${(i / (displayHistory.length - 1 || 1)) * 100}%`,
                  bottom: `${calculatePosition(game.playerGuess)}%`
                }}
                title={`Your guess: ${game.playerGuess}`}
              ></div>
            ))}
            {displayHistory.length > 1 && (
              <svg className="line-svg player">
                <polyline
                  points={displayHistory
                    .map((game, i) => `${(i / (displayHistory.length - 1)) * 100},${100 - calculatePosition(game.playerGuess)}`)
                    .join(' ')}
                />
              </svg>
            )}
          </div>
        </div>
        
        <div className="chart-x-axis">
          {displayHistory.map((game, i) => (
            <div 
              key={`x-${i}`} 
              className="x-label"
              style={{
                left: `${(i / (displayHistory.length - 1 || 1)) * 100}%`
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color player"></div>
          <span>Your Guesses</span>
        </div>
        <div className="legend-item">
          <div className="legend-color target"></div>
          <span>Target Numbers</span>
        </div>
        <div className="legend-item">
          <div className="legend-color winner"></div>
          <span>Winning Rounds</span>
        </div>
      </div>
    </div>
  );
};

export default GameHistoryChart;
