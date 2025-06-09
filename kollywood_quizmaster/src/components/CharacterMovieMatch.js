import React, { useEffect, useState, useRef } from "react";
import "./CharacterMovieMatch.css";

// STATIC list of known Vetrimaaran movie TMDb IDs for filtering (demo purposes)
const VETRIMAARAN_MOVIE_IDS = [
  // e.g., "Asuran", "Vada Chennai", "Aadukalam", "Visaranai", "Polladhavan", "Kodi", "Vaadivaasal"
  569232, // Asuran (2019)
  522056, // Vada Chennai (2018)
  67920,  // Aadukalam (2011)
  365198, // Visaranai (2016)
  137321, // Polladhavan (2007)
  425307, // Kodi (2016) (co-writer, not director but use as demo)
  // Add/update IDs as needed
];

// PUBLIC_INTERFACE
/**
 * CharacterMovieMatch: Misdirection round for "Vetrimaaran" clue.
 * User is instructed to drag the clue "Vetrimaaran" onto 1 of 4 posters (not actually directed by Vetrimaaran).
 * Feedback is always: "Wrong! None of these is a Vetrimaaran film."
 */
function CharacterMovieMatch({
  claimMoviesForRound,
  sessionInitialized,
  initializeSession,
  remainingCount,
  onGameEnd,
  onBack,
}) {
  // Only 1 puzzle for this special round
  const ROUND_SIZE = 4;
  const [roundMovies, setRoundMovies] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [selected, setSelected] = useState(null);

  // For drag state management
  const dragItem = useRef(null);

  // On mount: set up session and pick 4 movies not directed by Vetrimaaran
  useEffect(() => {
    if (!sessionInitialized) initializeSession();
    if (sessionInitialized && roundMovies.length === 0) {
      // Claim more than needed, then filter out Vetrimaaran films
      // fallback: try to claim more if not enough, but only round size is shown
      const claimed = claimMoviesForRound(8) || [];
      const filtered = claimed.filter(
        (m) => !VETRIMAARAN_MOVIE_IDS.includes(m.id)
      );
      // Pick up to 4 unique titles for the round
      setRoundMovies(filtered.slice(0, ROUND_SIZE));
    }
    // eslint-disable-next-line
  }, [sessionInitialized, claimMoviesForRound]);

  // Drag events for clue (Vetrimaaran)
  function onDragStart(e) {
    dragItem.current = "Vetrimaaran";
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text", "Vetrimaaran");
  }
  function onDragEnd() {
    dragItem.current = null;
  }

  // Allow dropping on posters
  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
  function onDrop(index) {
    setSelected(index);
    // Always wrong for this round (Vetrimaaran directed none)
    setFeedback("Wrong! None of these is actually a Vetrimaaran film. It's a trick question!");
    // For quiz result tracking: finish after drop
    setTimeout(() => {
      if (onGameEnd) {
        onGameEnd({
          correct: 0,
          total: 1,
          mode: "Character-Movie Match (Vetrimaaran Trick)",
          answers: [{ guess: index, correct: false }],
          roundMovies,
        });
      }
    }, 1700);
  }

  // Loading state
  if (roundMovies.length === 0) {
    return (
      <div className="game-panel glass-panel">
        <button className="btn btn-back" onClick={onBack}>← Back</button>
        <h2>🎬 Character-Movie Match: Vetrimaaran Round</h2>
        <em>Preparing your puzzle...</em>
      </div>
    );
  }

  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>🎬 Character-Movie Match <span style={{ fontSize: "1rem", fontWeight: 400 }}>(Vetrimaaran Trick&nbsp;Round)</span></h2>
      <div style={{ marginTop: 10, marginBottom: 13 }}>
        <b>Instructions:</b><br />
        <span style={{color: "#fb00ff"}}>
          Drag the clue "<b>Vetrimaaran</b>" to the movie poster you think matches.<br/>
          Careful – <b>none</b> of these movies is actually directed by Vetrimaaran!
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 19, marginBottom: 16 }}>
        {/* The draggable clue card */}
        <div
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          style={{
            background: "#1a0037",
            border: "2px dashed #fb00ff",
            color: "#fb00ff",
            fontWeight: 600,
            borderRadius: "14px",
            padding: "15px 32px",
            fontSize: "1.7rem",
            marginBottom: 10,
            cursor: "grab",
            opacity: selected !== null ? 0.33 : 1,
            transition: "opacity 0.2s"
          }}
          aria-grabbed={selected === null ? "false" : "true"}
          tabIndex={0}
        >
          Vetrimaaran
          <span style={{ fontWeight: 400, fontSize: "1rem", marginLeft: 6, color: "#fff9" }}>Director</span>
        </div>
        <div
          style={{
            display: "grid",
            // 2x2 poster grid for 4 options
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "18px",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {roundMovies.map((m, idx) => (
            <div
              key={m.id}
              className="poster-drop"
              onDragOver={selected === null ? onDragOver : undefined}
              onDrop={selected === null ? () => onDrop(idx) : undefined}
              tabIndex={0}
              style={{
                width: 155,
                minHeight: 230,
                background: selected === idx
                  ? "#fb00ff33"
                  : "var(--card-bg, #130013df)",
                border: selected === idx
                  ? "3.2px solid #fb00ff"
                  : "2.5px solid var(--border-color, #fb00ff66)",
                borderRadius: 13,
                boxShadow: selected === idx
                  ? "0 0 22px #fb00ff77"
                  : "0 2px 22px #fb00ff15",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: selected === null ? "pointer" : "default",
                opacity: selected !== null && selected !== idx ? 0.52 : 1,
                position: "relative",
                transition: "all 0.19s"
              }}
              aria-dropeffect={selected === null ? "move" : "none"}
            >
              {m.poster_path
                ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${m.poster_path}`}
                    alt={m.title}
                    style={{
                      width: 128,
                      height: 185,
                      objectFit: "cover",
                      borderRadius: 10,
                      marginBottom: 7,
                      boxShadow: selected === idx ? "0 0 0 3px #fb00ff" : ""
                    }}
                  />
                )
                : (
                  <div style={{
                    width: 128,
                    height: 185,
                    background: "#222",
                    color: "#fff7",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    marginBottom: 7
                  }}>No Poster</div>
                )}
              <div
                style={{
                  fontWeight: 600,
                  color: "#fff",
                  fontSize: "1.08rem",
                  letterSpacing: ".007em",
                  textAlign: "center"
                }}
              >
                {m.title}
              </div>
              {selected === idx && feedback && (
                <div style={{
                  color: "#fb00ff",
                  fontWeight: 600,
                  marginTop: 7,
                  background: "#180523e5",
                  borderRadius: 8,
                  padding: "5px 13px",
                  boxShadow: "0 0 10px #fb00ff44",
                  fontSize: "1rem"
                }}>
                  {feedback}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, minHeight: 28 }}>
          {selected !== null && feedback && (
            <span style={{ color: "#fb00ff", fontWeight: 500, fontSize: "1.12rem" }}>
              {feedback}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CharacterMovieMatch;
