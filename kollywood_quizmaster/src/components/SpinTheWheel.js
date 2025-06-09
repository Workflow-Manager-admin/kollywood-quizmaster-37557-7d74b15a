import React from "react";
import './SpinTheWheel.css';

// PUBLIC_INTERFACE
/**
 * Spin the Wheel mode.
 * Spin for actor, actress, and year; guess the movie (Scaffold).
 * @param {Object} props
 */
function SpinTheWheel({ movies, loading, onGameEnd, onBack }) {
  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>🌀 Spin the Wheel</h2>
      <p>Spin to pick actor, actress, and year. Guess the corresponding Kollywood movie!</p>
      <p><i>Stub view: Spinning wheel and question generation will be implemented later.</i></p>
      <button className="btn" onClick={() => onGameEnd({ correct: 9, total: 10, mode: "Spin the Wheel" })}>
        Finish Demo Round (simulate 9/10 correct)
      </button>
    </div>
  );
}
export default SpinTheWheel;
