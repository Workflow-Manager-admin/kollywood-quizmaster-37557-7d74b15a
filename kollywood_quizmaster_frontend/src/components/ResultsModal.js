import React from "react";

// PUBLIC_INTERFACE
function ResultsModal({ results, onClose }) {
  if (!results) return null;

  return (
    <div className="kollywood-modal-bg" onClick={onClose}>
      <div className="kollywood-modal" onClick={e => e.stopPropagation()}>
        <h2 className="kollywood-game-header">Game Complete!</h2>
        <div style={{ fontSize: "1.2rem", marginBottom: 24 }}>
          Score: <span style={{ color: "#fb00ff", fontWeight: 800 }}>{results.score}</span> / {results.total}
        </div>
        {results.answers && (
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: "#a246ff" }}>Review Answers:</h4>
            <ol>
              {results.answers.map((ans, idx) =>
                <li key={idx}>
                  <b>Q:</b> {ans.question} <br />
                  <span style={{ color: "#17b527" }}>{ans.correct ? "✔" : "✖"}</span>
                  <span style={{ color: "#af0077" }}> {ans.userAnswer}</span>
                  <br />
                  <span style={{ fontSize: 13 }}>Correct: {ans.correctAnswer}</span>
                </li>
              )}
            </ol>
          </div>
        )}
        <button className="kollywood-btn" onClick={onClose}>Back to Menu</button>
      </div>
    </div>
  );
}

export default ResultsModal;
