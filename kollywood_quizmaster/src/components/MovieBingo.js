import React from "react";
import './MovieBingo.css';

// PUBLIC_INTERFACE
/**
 * Movie Bingo mode.
 * Click movies matching a category (Scaffold only).
 * @param {Object} props
 */
function MovieBingo({ movies, loading, onGameEnd, onBack }) {
  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>🎲 Movie Bingo</h2>
      <p>Pick the Kollywood movies that match the category (e.g., "Won National Award").</p>
      <p><i>Stub view: Bingo grid/game logic and movie data integration to come.</i></p>
      <button className="btn" onClick={() => onGameEnd({ correct: 6, total: 10, mode: "Movie Bingo" })}>
        Finish Demo Round (simulate 6/10 correct)
      </button>
    </div>
  );
}
export default MovieBingo;
