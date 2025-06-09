import React from "react";
import './BlurredPosterGuess.css';

// PUBLIC_INTERFACE
/**
 * Blurred Poster Guess mode.
 * Scaffolding only: to be implemented using Kollywood movie data & poster images.
 * @param {Object} props
 */
function BlurredPosterGuess({ movies, loading, onGameEnd, onBack }) {
  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>🖼️ Blurred Poster Guess</h2>
      <p>Guess the Kollywood movie from a blurred poster and two clues!<br/>
        In the final version, you will see a blurred poster and you must type (or pick) the movie.</p>
      <p><i>Stub view: Game logic, rounds and answer input to be implemented.</i></p>
      <button className="btn" onClick={() => onGameEnd({ correct: 7, total: 10, mode: "Blurred Poster Guess" })}>
        Finish Demo Round (simulate 7/10 correct)
      </button>
    </div>
  );
}
export default BlurredPosterGuess;
