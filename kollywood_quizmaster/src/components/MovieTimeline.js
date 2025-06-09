import React from "react";
import './MovieTimeline.css';

// PUBLIC_INTERFACE
/**
 * Movie Timeline Challenge mode.
 * Arrange movies by release year (Scaffold only).
 * @param {Object} props
 */
function MovieTimeline({ movies, loading, onGameEnd, onBack }) {
  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>⏳ Movie Timeline Challenge</h2>
      <p>Arrange Kollywood movies in the correct order of their release dates.</p>
      <p><i>Stub view: Timeline slider and interactive matching will be developed.</i></p>
      <button className="btn" onClick={() => onGameEnd({ correct: 4, total: 10, mode: "Movie Timeline Challenge" })}>
        Finish Demo Round (simulate 4/10 correct)
      </button>
    </div>
  );
}
export default MovieTimeline;
