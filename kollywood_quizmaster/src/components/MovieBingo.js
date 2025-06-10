import React, { useState } from 'react';

// Demo data for one board (expand for real use)
const MOVIES = [
  { title: "Kaala", category: "Won National Award" },
  { title: "Pariyerum Perumal", category: "Social Drama" },
  { title: "Super Deluxe", category: "Critically Acclaimed" },
  { title: "96", category: "Romance" },
  { title: "Vikram Vedha", category: "Thriller" },
  { title: "Asuran", category: "Won National Award" },
  { title: "Mersal", category: "Action" },
  { title: "Master", category: "Blockbuster" },
  { title: "Joker", category: "Satire" }
];

const CATEGORY = "Won National Award";

// PUBLIC_INTERFACE
function MovieBingo({ onFinish }) {
  const [selected, setSelected] = useState([]);
  const [round, setRound] = useState(0);

  // Score: 1 point per correct
  function isCorrect(movie) {
    return movie.category === CATEGORY;
  }

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    let score = 0;
    const details = MOVIES.map(m => ({
      ...m,
      selected: selected.includes(m.title),
      correct: isCorrect(m) && selected.includes(m.title)
    }));
    score = details.filter(m => m.correct).length;
    onFinish({ score, attempts: details, game: "Movie Bingo" });
  }

  function handleToggle(title) {
    setSelected(sel =>
      sel.includes(title) ? sel.filter(t => t !== title) : [...sel, title]
    );
  }

  return (
    <section>
      <h2>Movie Bingo</h2>
      <p className="subtitle">Category: <b style={{ color: "#fb00ff" }}>{CATEGORY}</b></p>
      <form onSubmit={handleSubmit}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
          margin: "0 auto",
          maxWidth: 420
        }}>
          {MOVIES.map(movie => (
            <div
              key={movie.title}
              className="bingo-tile"
              style={{
                background: selected.includes(movie.title) ? "#fb00ff" : "#1a1a1a",
                color: selected.includes(movie.title) ? "#fff" : "#fb00ff",
                borderRadius: 9,
                padding: "22px 8px",
                textAlign: "center",
                border: "2px solid #fb00ff",
                cursor: "pointer",
                fontSize: 17
              }}
              onClick={() => handleToggle(movie.title)}
            >
              {movie.title}
            </div>
          ))}
        </div>
        <button className="btn btn-large" type="submit" style={{ marginTop: 18 }}>
          Submit Selections
        </button>
      </form>
    </section>
  )
}

export default MovieBingo;
