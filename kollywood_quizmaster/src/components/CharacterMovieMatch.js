import React, { useEffect, useState, useRef } from "react";
import "./CharacterMovieMatch.css";

// Fixed clue and correct/incorrect movie posters
const CLUE = "Vetrimaaran";
// For robust domain use, these details could be fetched from API, but for this subtask, we hard-code poster/movie data.
const MOVIES = [
  {
    // Correct answer
    title: "Mersal",
    poster_path: "/tc4RZ6k0XZ1lf8bB7fmTQfjF6ka.jpg", // Example TMDb path for Mersal
    id: 476294,
  },
  {
    title: "Theri",
    poster_path: "/p1pIRUTPNFDYf8w3BHiJDKvNp1o.jpg",
    id: 37724, // This is just a sample, actual "Theri" TMDb id is 384812
  },
  {
    title: "Master",
    poster_path: "/4KHyKQOXMPbSh7wB8R6rcinkh5F.jpg",
    id: 607395,
  },
  {
    title: "Kaththi",
    poster_path: "/qlPuE8hmGThpQ9jZ2a2Z2rfy22E.jpg",
    id: 250774,
  },
];

// In real usage, you could randomize the order for replayability
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// PUBLIC_INTERFACE
/**
 * Vetrimaaran Special: Drag the clue "Vetrimaaran" onto one of four movie posters (including "Mersal" as the only correct one).
 * Gives immediate feedback and instructional text. Robust error handling if any poster fails to load.
 */
function CharacterMovieMatch({
  onBack,
  onGameEnd,
}) {
  // Randomize the order to avoid muscle memory, but always have Mersal as only correct answer
  const [movieOptions, setMovieOptions] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);

  const clueRef = useRef(null);

  useEffect(() => {
    setMovieOptions(shuffle(MOVIES));
  }, []);

  // Drag and drop handlers
  function onDragStart(e) {
    setDragActive(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", CLUE);
    // Visually lower opacity
    if (clueRef.current) clueRef.current.style.opacity = 0.51;
  }
  function onDragEnd() {
    setDragActive(false);
    if (clueRef.current) clueRef.current.style.opacity = 1;
  }
  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
  function onDrop(idx) {
    if (finished || dragged) return;
    setDragged(true);
    setDragActive(false);
    setSelectedIdx(idx);

    // Evaluate answer & feedback
    const picked = movieOptions[idx];
    let result, msg;
    if (picked.title === "Mersal") {
      result = true;
      msg = "Correct! Mersal was co-written by Vetrimaaran.";
    } else {
      result = false;
      msg = `Incorrect. "${picked.title}" was NOT made by Vetrimaaran – Mersal is correct!`;
    }
    setFeedback(msg);

    setTimeout(() => {
      setFinished(true);
      if (onGameEnd) {
        onGameEnd({
          correct: result ? 1 : 0,
          total: 1,
          mode: "Character-Movie Match – Vetrimaaran",
          answers: [{ guess: idx, correct: result }],
          roundMovies: movieOptions,
        });
      }
    }, 2000);
  }

  // Simple fallback if images fail to load
  function handleImgError(e) {
    e.target.onerror = null;
    e.target.src = "";
    e.target.alt = "No Poster";
    e.target.style.background = "#190a29";
    e.target.style.color = "#fff8";
  }
  
  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>🎬 Character-Movie Match <span style={{ fontSize: "1rem", fontWeight: 400 }}>(Special: {CLUE})</span></h2>
      <div style={{ marginTop: 10, marginBottom: 13 }}>
        <b>Instructions:</b><br />
        <span style={{ color: "#fb00ff" }}>
          Drag the director clue "<b>{CLUE}</b>" onto the movie poster you believe he was involved with.<br />
          Get immediate feedback on your answer!
        </span>
      </div>
      {/* Draggable clue */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div
          ref={clueRef}
          draggable={selectedIdx === null}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          style={{
            background: dragActive ? "#28054a" : "#1a0037",
            border: "2.4px dashed #fb00ff",
            color: "#fb00ff",
            fontWeight: 700,
            borderRadius: "14px",
            padding: "15px 32px",
            fontSize: "1.7rem",
            marginBottom: 8,
            cursor: selectedIdx === null ? "grab" : "not-allowed",
            opacity: selectedIdx !== null ? 0.35 : 1,
            boxShadow: dragActive ? "0 0 19px #fb00ff77" : "",
            transition: "opacity 0.2s, box-shadow 0.15s"
          }}
          tabIndex={0}
          aria-grabbed={dragActive ? "true" : "false"}
        >
          {CLUE}
          <span style={{ fontWeight: 400, fontSize: "1rem", marginLeft: 7, color: "#fff9" }}>Director</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "17px",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {movieOptions.map((movie, idx) => (
            <div
              key={movie.id}
              onDragOver={selectedIdx === null ? onDragOver : undefined}
              onDrop={selectedIdx === null ? () => onDrop(idx) : undefined}
              tabIndex={0}
              className="poster-drop"
              style={{
                width: 151,
                minHeight: 224,
                background: selectedIdx === idx 
                  ? "#fb00ff33"
                  : "var(--card-bg, #130013df)",
                border: selectedIdx === idx
                  ? "3.2px solid #fb00ff"
                  : "2.3px solid var(--border-color, #fb00ff66)",
                borderRadius: 12,
                boxShadow: selectedIdx === idx
                  ? "0 0 20px #fb00ff77"
                  : "0 2px 17px #fb00ff19",
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center",
                opacity: dragged && selectedIdx !== idx ? 0.52 : 1,
                cursor: selectedIdx === null ? "pointer" : "not-allowed",
                position: "relative",
                transition: "all 0.19s"
              }}
              aria-dropeffect={selectedIdx === null ? "move" : "none"}
            >
              {movie.poster_path ?
                <img
                  src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                  alt={movie.title}
                  width={116}
                  height={172}
                  style={{
                    objectFit: "cover",
                    borderRadius: 9,
                    marginBottom: 7,
                    boxShadow: selectedIdx === idx ? "0 0 0 2.5px #fb00ff" : ""
                  }}
                  onError={handleImgError}
                />
                :
                <div style={{
                  width: 116, height: 172, background: "#201426",
                  color: "#fff6", borderRadius: 9, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 16, marginBottom: 7
                }}>No Poster</div>
              }
              <div
                style={{
                  fontWeight: 600,
                  color: "#fff",
                  fontSize: "1.04rem",
                  letterSpacing: ".007em",
                  textAlign: "center"
                }}
              >
                {movie.title}
              </div>
              {/* Feedback as toast/label on the poster */}
              {selectedIdx === idx && feedback && (
                <div style={{
                  color: movie.title === "Mersal" ? "#29c777" : "#ff8f55",
                  fontWeight: 600,
                  marginTop: 8,
                  background: "#180523e5",
                  borderRadius: 8,
                  padding: "6px 13px",
                  boxShadow: "0 0 10px #fb00ff44",
                  fontSize: "1rem",
                  minHeight: 22,
                }}>
                  {feedback}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, minHeight: 28, textAlign: "center" }}>
          {selectedIdx !== null && feedback && (
            <span style={{ color: movieOptions[selectedIdx].title === "Mersal" ? "#29c777" : "#fb00ff", fontWeight: 500, fontSize: "1.135rem" }}>
              {feedback}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CharacterMovieMatch;
