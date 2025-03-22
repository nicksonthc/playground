import React from "react";
import "./GameTheoryComponents.css";

const GameSetupVisual = ({
  aiPlayers,
  setAiPlayers,
  aiStrategy,
  setAiStrategy,
  playerGuess,
  handleGuessChange,
  playGame,
  isPlayButtonDisabled
}) => {
  // AI behavior descriptions based on strategy
  const strategyDescriptions = {
    random: "AI players will guess completely randomly between 0-100.",
    mixed:
      "Some AIs will guess optimally (near 0), some naively (near 50-70), and some in between.",
    optimal: "AI players will guess close to the Nash equilibrium (near 0).",
  };

  return (
    <div className="game-setup card-container">
      <h2>Game Setup</h2>

      <div className="game-visual-container">
        <div className="players-visual">
          <div className="player-you">
            <div className="player-avatar you"></div>
            <span>You</span>
          </div>

          <div className="vs-indicator">VS</div>

          <div className="ai-players-container">
            {[...Array(aiPlayers)].map((_, i) => (
              <div key={i} className="player-avatar ai">
                <span>{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-controls visual">
          <div className="setting-group">
            <label>
              Number of AI Players:{" "}
              <span className="value-display">{aiPlayers}</span>
            </label>
            <div className="slider-container">
              <span className="min-value">2</span>
              <input
                type="range"
                min="2"
                max="10"
                value={aiPlayers}
                onChange={(e) => setAiPlayers(parseInt(e.target.value))}
                className="visual-slider"
              />
              <span className="max-value">10</span>
            </div>
          </div>

          <div className="setting-group">
            <label>AI Intelligence Level:</label>
            <div className="strategy-options">
              <button
                className={`strategy-btn ${
                  aiStrategy === "random" ? "active" : ""
                }`}
                onClick={() => setAiStrategy("random")}
              >
                Random
              </button>
              <button
                className={`strategy-btn ${
                  aiStrategy === "mixed" ? "active" : ""
                }`}
                onClick={() => setAiStrategy("mixed")}
              >
                Mixed
              </button>
              <button
                className={`strategy-btn ${
                  aiStrategy === "optimal" ? "active" : ""
                }`}
                onClick={() => setAiStrategy("optimal")}
              >
                Near Optimal
              </button>
            </div>
            <p className="strategy-description">
              {strategyDescriptions[aiStrategy]}
            </p>
          </div>
        </div>

        <div className="number-line-container">
          <div className="number-line">
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((num) => (
              <div
                key={num}
                className="number-tick"
                style={{ left: `${num}%` }}
              >
                <div className="tick"></div>
                <span>{num}</span>
              </div>
            ))}
            {playerGuess !== "" && (
              <div
                className="player-guess-marker"
                style={{ left: `${playerGuess}%` }}
                title={`Your guess: ${playerGuess}`}
              ></div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={playGame} className="game-form visual">
        <div className="input-group large-form-group">
          <label
            className="large-text extra-large"
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              display: "block",
              marginBottom: "8px",
            }}
          >
            Your Guess (0-100):
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={playerGuess}
            onChange={handleGuessChange}
            placeholder="Enter a number between 0-100"
            required
            className="large-input extra-large-input"
            style={{
              fontSize: "1rem",
              padding: "10px",
              fontWeight: "bold",
              width: "100%",
              maxWidth: "300px",
            }}
          />
        </div>
        <button
          type="submit"
          className="play-btn large-text"
          style={{
            marginTop: "8px",
          }}
          onClick={playGame}
          disabled={isPlayButtonDisabled}
        >
          Play Game
        </button>
      </form>
    </div>
  );
};

export default GameSetupVisual;
