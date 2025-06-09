import React, { useState, useEffect } from "react";
import './MovieBingo.css';

/**
 * Movie Bingo mode - implemented with unique, non-repeating movies for round.
 * Player selects all movies matching a drawn category (simulated as 'keyword' includes "love"/"action"/etc).
 */
function MovieBingo({
  claimMoviesForRound,
  sessionInitialized,
  initializeSession,
  remainingCount,
  onGameEnd,
  onBack,
}) {
  const ROUND_SIZE = 12;
  const CATEGORY_KEYWORDS = ["Love", "Action", "King", "Murder", "Family", "Music"];
  const [roundMovies, setRoundMovies] = useState([]);
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState({});
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (!sessionInitialized) initializeSession();
    if (sessionInitialized && roundMovies.length === 0) {
      const claimed = claimMoviesForRound(ROUND_SIZE);
      if (claimed && claimed.length === ROUND_SIZE) {
        setRoundMovies(claimed);
        setCategory(CATEGORY_KEYWORDS[Math.floor(Math.random() * CATEGORY_KEYWORDS.length)]);
      }
    }
    // eslint-disable-next-line
  }, [sessionInitialized, claimMoviesForRound]);

  if (roundMovies.length === 0) {
    return (
      <div className="game-panel glass-panel">
        <button className="btn btn-back" onClick={onBack}>← Back</button>
        <h2>🎲 Movie Bingo</h2>
        <em>Preparing bingo grid...</em>
      </div>
    );
  }

  // Simulate "matches category" as movie whose title or overview contains the keyword
  const filterByCategory = (m, cat) => {
    const field = (m.title + " " + (m.overview || "")).toLowerCase();
    return field.includes(cat.toLowerCase());
  };
  const correctIds = roundMovies.filter(m => filterByCategory(m, category)).map(m => m.id);

  function handleSelect(mid) {
    setSelected(prev => ({ ...prev, [mid]: !prev[mid] }));
  }
  function handleFinish() {
    setAnswered(true);
    // End after showing correct and selected
    setTimeout(() => {
      const numCorrect = roundMovies.filter(m => filterByCategory(m, category) && selected[m.id]).length;
      onGameEnd({
        correct: numCorrect,
        total: correctIds.length,
        mode: "Movie Bingo",
        roundMovies, category, answers: selected,
      });
    }, 1700);
  }

  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>🎲 Movie Bingo</h2>
      <div style={{ marginBottom: '8px' }}>
        <b>Category:</b>
        <span style={{ color: "#fb00ff", marginLeft: 6 }}>{category}</span>
        <span style={{ fontSize: '0.9em', color: '#fff7', marginLeft: 8 }}>{correctIds.length} correct in grid</span>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px 6px', margin: '0 auto', maxWidth: 450
      }}>
        {roundMovies.map(movie =>
          <button
            key={movie.id}
            className="btn"
            style={{
              background: answered
                ? correctIds.includes(movie.id)
                  ? '#29c777'
                  : selected[movie.id]
                    ? '#fa0'
                    : 'var(--card-bg)'
                : selected[movie.id]
                  ? "#fb00ffcc"
                  : 'var(--card-bg)',
              color: answered
                ? '#fff'
                : selected[movie.id]
                  ? '#fff'
                  : '#fb00ff',
              fontWeight: 600,
              padding: '12px 4px',
              border: '2px solid var(--border-color)',
              borderRadius: '9px',
              cursor: !answered ? 'pointer' : 'default',
              transition: 'background .20s'
            }}
            onClick={() => !answered && handleSelect(movie.id)}
            disabled={answered}
          >
            {movie.title}
          </button>
        )}
      </div>
      <div style={{ marginTop: 14 }}>
        {!answered ? (
          <button className="btn" onClick={handleFinish} disabled={Object.values(selected).every(v => !v)}>
            Submit Bingo Picks
          </button>
        ) : <b>Scoring...</b>}
      </div>
    </div>
  );
}

export default MovieBingo;
