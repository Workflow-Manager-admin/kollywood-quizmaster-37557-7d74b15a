import React from "react";
import './CastCombo.css';

// PUBLIC_INTERFACE
/**
 * Cast Combo mode (and reverse).
 * Guess movie from actor combo, or pick odd-one-out (Scaffold).
 * @param {Object} props
 */
function CastCombo({ movies, loading, onGameEnd, onBack }) {
  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>👥 Cast Combo</h2>
      <p>Guess the Kollywood movie given a combination of 2–3 actors. Bonus: Reverse mode – pick the actor NOT in a given movie.</p>
      <p><i>Stub view: Combo logic and reverse-guess round to be developed.</i></p>
      <button className="btn" onClick={() => onGameEnd({ correct: 5, total: 10, mode: "Cast Combo" })}>
        Finish Demo Round (simulate 5/10 correct)
      </button>
    </div>
  );
}
export default CastCombo;
