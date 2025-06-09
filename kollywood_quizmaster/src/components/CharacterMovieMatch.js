import React from "react";
import './CharacterMovieMatch.css';

// PUBLIC_INTERFACE
/**
 * Character-Movie Match mode.
 * Drag and drop characters to their movies (Scaffold only).
 * @param {Object} props
 */
function CharacterMovieMatch({ movies, loading, onGameEnd, onBack }) {
  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>👤 Character-Movie Match</h2>
      <p>Match each Kollywood character to their movie via drag and drop.</p>
      <p><i>Stub view: Interactive drag-and-drop game logic to be implemented in future.</i></p>
      <button className="btn" onClick={() => onGameEnd({ correct: 8, total: 10, mode: "Character-Movie Match" })}>
        Finish Demo Round (simulate 8/10 correct)
      </button>
    </div>
  );
}
export default CharacterMovieMatch;
