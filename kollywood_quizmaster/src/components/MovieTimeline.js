import React, { useState } from 'react';

// Demo round with 4 movies (expand for real)
const MOVIES = [
  { title: "Moondram Pirai", year: 1982 },
  { title: "Anbe Sivam", year: 2003 },
  { title: "Dasavathaaram", year: 2008 },
  { title: "Vikram", year: 1986 }
];

// PUBLIC_INTERFACE
function MovieTimeline({ onFinish }) {
  const [order, setOrder] = useState(MOVIES.map(m => m.title));
  const [submitted, setSubmitted] = useState(false);

  function move(fromIdx, toIdx) {
    if (toIdx < 0 || toIdx >= order.length) return;
    const arr = [...order];
    const [removed] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, removed);
    setOrder(arr);
  }

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    // Calculate score: +1 for each correct position
    let score = 0;
    const correct = [...MOVIES].sort((a, b) => a.year - b.year).map(m => m.title);
    for (let i = 0; i < correct.length; i++) {
      if (order[i] === correct[i]) score++;
    }
    onFinish({ score, attempts: order, game: "Movie Timeline Challenge", correctOrder: correct });
  }

  return (
    <section>
      <h2>Movie Timeline Challenge</h2>
      <p className="subtitle">Order these movies from earliest to latest (top = earliest):</p>
      <form onSubmit={handleSubmit}>
        <ul style={{ listStyle: 'none', padding: 0, maxWidth: 320, margin: '0 auto' }}>
          {order.map((movie, idx) =>
            <li
              key={movie}
              style={{
                background: "#1a1a1a",
                border: "2px solid #fb00ff",
                borderRadius: 7,
                padding: "12px 24px",
                color: "#fb00ff",
                marginBottom: 6,
                userSelect: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
              <span>{movie}</span>
              <span>
                <button
                  style={btnGhost}
                  type="button"
                  onClick={() => move(idx, idx - 1)}
                  disabled={idx === 0}
                >▲</button>
                <button
                  style={btnGhost}
                  type="button"
                  onClick={() => move(idx, idx + 1)}
                  disabled={idx === order.length - 1}
                >▼</button>
              </span>
            </li>
          )}
        </ul>
        <button className="btn" type="submit" style={{ marginTop: 16 }}>
          Submit Timeline
        </button>
      </form>
    </section>
  )
}

const btnGhost = {
  background: "none",
  border: "none",
  color: "#fb00ff",
  fontSize: 18,
  cursor: "pointer",
  marginLeft: 7,
  marginRight: 2
};

export default MovieTimeline;
