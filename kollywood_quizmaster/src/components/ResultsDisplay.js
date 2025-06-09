import React from "react";
import './ResultsDisplay.css';

// PUBLIC_INTERFACE
/**
 * Results display for completed quiz rounds.
 * @param {{results: object, onHome: function}} props
 */
function ResultsDisplay({ results, onHome }) {
  // Show score summary and stub answer view
  return (
    <div className="results-panel glass-panel">
      <h2>Results: {results?.mode || "Quiz Mode"}</h2>
      <div className="results-score">
        <span className="big-num">{results?.correct ?? 0}</span>
        <span className="score-divider">/</span>
        <span className="big-num">{results?.total ?? 10}</span>
      </div>
      <div className="results-message">
        {results?.correct !== undefined && (
          results.correct >= 8 ? "👏 Fantastic!" :
            results.correct >= 6 ? "🎉 Good job!" :
              "👍 Keep practicing!"
        )}
        <br />
        <span className="results-answers-label">(End-of-round answers page coming soon...)</span>
      </div>
      <button className="btn" onClick={onHome}>Back to Home</button>
    </div>
  );
}
export default ResultsDisplay;
