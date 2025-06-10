import React from 'react';

// PUBLIC_INTERFACE
function ResultsModal({ results, onClose }) {
  // results: { score, attempts, game, ... }
  return (
    <div className="modal-bg">
      <div className="modal results-modal">
        <h2 style={{ color: "#fb00ff" }}>Game Over!</h2>
        <h3>{results.game}</h3>
        <div style={{ fontSize: 22, fontWeight: 500, margin: "10px 0 15px 0" }}>
          Score: <span style={{ color: "#fb00ff" }}>{results.score}</span>
        </div>
        <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: 12, width: "100%" }}>
          {/* Vary by game: show answers/attempts */}
          {Array.isArray(results.attempts) && (
            <table style={tblStyle}>
              <tbody>
                {results.attempts.map((a, idx) => {
                  if (results.game === 'Blurred Poster Guess')
                    return (
                      <tr key={idx}>
                        <td>Q{idx+1} Clues:<br/>
                          <ul style={{ margin: 0, padding:'0 0 0 13px' }}>{a.clues && a.clues.map((c, i) => <li key={i}>{c}</li>)}</ul>
                        </td>
                        <td>Your guess: <b style={{ color: a.isCorrect ? "#12ff44" : "#fb00ff" }}>{a.guess}</b></td>
                        <td>Answer: <b>{a.answer}</b></td>
                        <td>{a.isCorrect ? "✔️" : "❌"}</td>
                      </tr>
                    );
                  if (results.game === 'Character-Movie Match')
                    return (
                      <tr key={idx}>
                        <td>Correct: {a.correct}</td>
                        <td>
                          {Object.entries(a)
                            .filter(([k, v]) => k !== "correct")
                            .map(([k, v]) => (
                              <div key={k} style={{ color: "#fb00ff" }}>{k}: <b>{v}</b></div>
                            ))}
                        </td>
                      </tr>
                    );
                  if (results.game === 'Movie Bingo')
                    return (
                      <tr key={idx}>
                        <td>{a.title}</td>
                        <td>Selected: {a.selected ? "✔️" : "❌"}</td>
                        <td>Category: {a.category}</td>
                        <td>{a.correct ? "Correct!" : ""}</td>
                      </tr>
                    );
                  if (results.game === 'Movie Timeline Challenge')
                    return (
                      <tr key={idx}>
                        <td>{a}</td>
                        <td>{results.correctOrder && results.correctOrder[idx] && (a === results.correctOrder[idx] ? "✔️" : "❌")}</td>
                        <td>Release Pos.: {results.correctOrder && results.correctOrder[idx]}</td>
                      </tr>
                    );
                  if (results.game === 'Spin the Wheel')
                    return (
                      <tr key={idx}>
                        <td>Actor: {a.actor}</td>
                        <td>Actress: {a.actress}</td>
                        <td>Year: {a.year}</td>
                        <td>Your guess: <b>{a.guess}</b></td>
                        <td>{a.correct ? "✔️" : "❌"}</td>
                      </tr>
                    );
                  if (results.game === 'Cast Combo')
                    return (
                      <tr key={idx}>
                        <td>{a.mode === "normal" ? (
                          <>Actors: {a.actors && a.actors.join(', ')}</>
                        ) : (
                          <>Not in: {a.notIn}<br />Among: {a.actors && a.actors.join(', ')}</>
                        )}</td>
                        <td>Your answer: {a.guess}</td>
                        <td>{a.correct ? "✔️" : "❌"}</td>
                        <td>Answer: {a.answer}</td>
                      </tr>
                    )
                  return null;
                })}
              </tbody>
            </table>
          )}
        </div>
        <button className="btn btn-large" onClick={onClose}>Back to Home</button>
      </div>
    </div>
  )
}

// Minimal table style for answer presentation
const tblStyle = {
  borderCollapse: "collapse",
  width: "100%",
  fontSize: 15,
  color: "#fff"
};

export default ResultsModal;
