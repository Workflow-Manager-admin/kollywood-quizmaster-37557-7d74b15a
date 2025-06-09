import React, { useEffect, useState, useRef } from "react";
import "./CharacterMovieMatch.css";

// PUBLIC_INTERFACE
/**
 * CharacterMovieMatch: 10 rounds with a unique character/movie clue and 4 unique, valid poster movie options (no repeats per session).
 * Each round: drag the clue to a poster. Auto-advance after drop. Show end-of-game result with feedback and score summary.
 *
 * @param {{
 *   claimMoviesForRound: function,
 *   sessionInitialized: boolean,
 *   initializeSession: function,
 *   remainingCount: number,
 *   onGameEnd: function,
 *   onBack: function,
 * }} props
 */
function CharacterMovieMatch({
  claimMoviesForRound,
  sessionInitialized,
  initializeSession,
  remainingCount,
  onGameEnd,
  onBack,
}) {
  // Game constants
  const TOTAL_ROUNDS = 10;
  const OPTIONS_PER_ROUND = 4;
  // Character/Director for the round
  const CHARACTER = "Vetrimaaran";

  // Hardcoded list of Vetrimaaran movies with posters (as clues)
  // Note: Must be at least 10 for 10 rounds
  const CHARACTER_MOVIES = [
    {
      title: "Visaranai",
      tmdb_id: 374720,
      poster_path: "/4rCZVG4n5c4IbzIXgHHKcS0QGsw.jpg"
    },
    {
      title: "Aadukalam",
      tmdb_id: 54858,
      poster_path: "/4g4sb7TAtrtpemTq9iAXTh9tPfB.jpg"
    },
    {
      title: "Asuran",
      tmdb_id: 573530,
      poster_path: "/zggcTQEWh05RzTRiXOBCENcyzmO.jpg"
    },
    {
      title: "Vada Chennai",
      tmdb_id: 470926,
      poster_path: "/8HVGjzxubAEANMQggqRAsoe5nBr.jpg"
    },
    {
      title: "Vaanam Kottattum",
      tmdb_id: 656114,
      poster_path: "/98zoyzjRNl6jXgKQ5DltM8p6Ndt.jpg"
    },
    {
      title: "Pudhupettai",
      tmdb_id: 34826,
      poster_path: "/7DwsS5sz34JEoLNnNm5WYQg2BKy.jpg"
    },
    {
      title: "Polladhavan",
      tmdb_id: 77895,
      poster_path: "/gp02lHgVdibgykjSzDbM9YNQJ1l.jpg"
    },
    {
      title: "Kodi",
      tmdb_id: 422253,
      poster_path: "/jenRq2UTWyxlL6ZSnM4tPFQyu1J.jpg"
    },
    {
      title: "Udaan (Telugu dubbed)",
      tmdb_id: 499758,
      poster_path: "/4N6S8vIOwFI9vHh4zI8hwlPPKaq.jpg"
    },
    {
      title: "Visiri",
      tmdb_id: 593246,
      poster_path: "/U3tOgLGwawx9CUIELTSfKQnIus.jpg"
    }
  ].filter(m => !!m.poster_path);

  // State
  const [quizRounds, setQuizRounds] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userGuesses, setUserGuesses] = useState([]); // each: {guessIdx, correctIdx, correct, chosenTitle, correctTitle}
  const [droppedIdx, setDroppedIdx] = useState(null); // user's drop this round
  const [showFeedback, setShowFeedback] = useState(false); // animate feedback overlay
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const clueRef = useRef(null);

  // Helper: Shuffle array (pure, not mutating passed-in)
  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // On mount/setup: build quizRounds: 
  // (1 unique character-movie per round, 3 decoys per round, posters never reused, movies never repeated)
  useEffect(() => {
    if (!sessionInitialized) {
      initializeSession();
      setLoading(true);
      return;
    }
    if (sessionInitialized && quizRounds.length === 0) {
      // Claim a decoy pool big enough for all decoy needs
      // At most 10 rounds × 3 decoys = 30, but we claim more to reject movies with invalid images, etc.
      let decoyPool = claimMoviesForRound(TOTAL_ROUNDS * 10) || [];
      if (!Array.isArray(decoyPool)) decoyPool = [];
      // Remove any with missing posters or sharing poster with any clue (no repeats)
      const characterIds = new Set(CHARACTER_MOVIES.map(m => String(m.tmdb_id)));
      decoyPool = decoyPool.filter(
        m =>
          !!m.poster_path &&
          !characterIds.has(String(m.id)) &&
          m.title
      );
      // Shuffle to randomize order
      decoyPool = shuffle(decoyPool);

      const availableClues = shuffle(CHARACTER_MOVIES).slice(0, TOTAL_ROUNDS);
      const usedPosters = new Set();
      const usedMovieIds = new Set();

      // Compose quizRounds
      const rounds = [];
      for (let i = 0; i < availableClues.length; ++i) {
        const clueMovie = availableClues[i];
        usedPosters.add(clueMovie.poster_path);
        usedMovieIds.add(clueMovie.tmdb_id);

        // Only allow decoys that have not been used as options for any prior round
        // and do not share poster with any clue or earlier option.
        const validDecoys = decoyPool.filter(
          m =>
            !usedPosters.has(m.poster_path) &&
            !usedMovieIds.has(m.id)
        );
        const chosenDecoys = shuffle(validDecoys).slice(0, OPTIONS_PER_ROUND - 1);
        chosenDecoys.forEach(d => {
          usedPosters.add(d.poster_path);
          usedMovieIds.add(d.id);
        });

        // Insert correct answer at random position
        const insertAt = Math.floor(Math.random() * OPTIONS_PER_ROUND);
        const options = chosenDecoys.slice();
        options.splice(insertAt, 0, {
          title: clueMovie.title,
          tmdb_id: clueMovie.tmdb_id,
          poster_path: clueMovie.poster_path
        });

        rounds.push({
          clueMovie,
          options,
          correctIdx: insertAt
        });
      }

      setQuizRounds(rounds);
      setCurrentIdx(0);
      setUserGuesses([]);
      setDroppedIdx(null);
      setShowFeedback(false);
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [sessionInitialized, claimMoviesForRound]);

  // ---- Drag/drop events ----
  function onDragStart(e) {
    setDragActive(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", CHARACTER);
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
  function handleDrop(idx) {
    // Don't allow if already answered or feedback is ongoing
    if (droppedIdx !== null || showFeedback) return;
    setDroppedIdx(idx);
    setDragActive(false);
    setShowFeedback(true);

    const round = quizRounds[currentIdx];
    const isCorrect = idx === round.correctIdx;
    setUserGuesses(prev =>
      prev.concat({
        guessIdx: idx,
        correctIdx: round.correctIdx,
        correct: isCorrect,
        chosenTitle: round.options[idx].title,
        correctTitle: round.options[round.correctIdx].title
      })
    );

    // Auto-advance after feedback
    setTimeout(() => {
      if (currentIdx + 1 === quizRounds.length) {
        // End of game, call summary handler
        if (onGameEnd) {
          const correctCount =
            [...userGuesses, { correct: isCorrect }].filter(ans => ans.correct).length;
          onGameEnd({
            correct: correctCount,
            total: quizRounds.length,
            mode: "Character-Movie Match",
            answers: [
              ...userGuesses,
              {
                guessIdx: idx,
                correctIdx: round.correctIdx,
                correct: isCorrect,
                chosenTitle: round.options[idx].title,
                correctTitle: round.options[round.correctIdx].title
              }
            ],
            roundMovies: quizRounds.map(r => r.options[r.correctIdx])
          });
        }
      } else {
        setCurrentIdx(c => c + 1);
        setDroppedIdx(null);
        setShowFeedback(false);
      }
    }, 1200);
  }

  // Poster rendering helper (handles missing poster gracefully)
  function renderPoster(movie) {
    return movie.poster_path ? (
      <img
        src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
        alt={movie.title}
        width={116}
        height={172}
        style={{
          objectFit: "cover",
          borderRadius: 9,
          marginBottom: 7
        }}
        onError={e => {
          e.target.onerror = null;
          e.target.src = "";
          e.target.alt = "No Poster";
          e.target.style.background = "#190a29";
          e.target.style.color = "#fff8";
          e.target.style.width = "116px";
          e.target.style.height = "172px";
          e.target.style.display = "flex";
          e.target.style.alignItems = "center";
          e.target.style.justifyContent = "center";
          e.target.style.fontSize = "16px";
          e.target.style.marginBottom = "7px";
          e.target.style.borderRadius = "9px";
        }}
      />
    ) : (
      <div
        style={{
          width: 116,
          height: 172,
          background: "#201426",
          color: "#fff6",
          borderRadius: 9,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          marginBottom: 7
        }}
      >
        No Poster
      </div>
    );
  }

  // Fallback loader/unavailable state
  if (
    loading ||
    !Array.isArray(quizRounds) ||
    quizRounds.length === 0 ||
    currentIdx >= quizRounds.length ||
    !quizRounds[currentIdx]
  ) {
    return (
      <div className="game-panel glass-panel">
        <button className="btn btn-back" onClick={onBack}>← Back</button>
        <h2>🎬 Character-Movie Match <span style={{ fontSize: "1rem", fontWeight: 400 }}>({CHARACTER})</span></h2>
        <em>Preparing your character-movie match round...</em>
      </div>
    );
  }

  // Main UI for a round
  const round = quizRounds[currentIdx];
  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>
        🎬 Character-Movie Match
        <span style={{
          fontSize: "1rem",
          fontWeight: 400,
          marginLeft: 8
        }}>(Q{currentIdx + 1}/{quizRounds.length})</span>
      </h2>
      <div style={{ marginTop: 10, marginBottom: 14 }}>
        <b>Instructions:</b><br />
        <span style={{ color: "#fb00ff" }}>
          Drag the <b>character clue</b> "<b>{CHARACTER}</b>" onto the movie poster that
          <br />best matches the character/director.
          <br />
          <span style={{ fontSize: "0.98em", color: "#fff8" }}>
            All clues are "Vetrimaaran" &mdash; select his film!
          </span>
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        {/* DRAGGABLE CLUE */}
        <div
          ref={clueRef}
          draggable={droppedIdx === null && !showFeedback}
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
            cursor: droppedIdx === null && !showFeedback ? "grab" : "not-allowed",
            opacity: droppedIdx !== null || showFeedback ? 0.35 : 1,
            boxShadow: dragActive ? "0 0 19px #fb00ff77" : "",
            transition: "opacity 0.2s, box-shadow 0.15s"
          }}
          tabIndex={0}
          aria-grabbed={dragActive ? "true" : "false"}
        >
          {CHARACTER}
          <span style={{
            fontWeight: 400,
            fontSize: "1rem",
            marginLeft: 7,
            color: "#fff9"
          }}>Character</span>
        </div>
        {/* POSTER GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "17px",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {round.options.map((movie, idx) => (
            <div
              key={movie.tmdb_id + "-" + idx}
              onDragOver={droppedIdx === null && !showFeedback ? onDragOver : undefined}
              onDrop={droppedIdx === null && !showFeedback ? () => handleDrop(idx) : undefined}
              tabIndex={0}
              className="poster-drop"
              style={{
                width: 151,
                minHeight: 224,
                background: droppedIdx === idx && showFeedback
                  ? (idx === round.correctIdx ? "#29c77733" : "#fb00ff33")
                  : "var(--card-bg, #130013df)",
                border: droppedIdx === idx && showFeedback
                  ? (idx === round.correctIdx ? "3.4px solid #29c777" : "3.2px solid #fb00ff")
                  : "2.3px solid var(--border-color, #fb00ff66)",
                borderRadius: 12,
                boxShadow: droppedIdx === idx && showFeedback
                  ? "0 0 20px #fb00ff77"
                  : "0 2px 17px #fb00ff19",
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center",
                opacity: droppedIdx !== null && droppedIdx !== idx ? 0.52 : 1,
                cursor: droppedIdx === null && !showFeedback ? "pointer" : "not-allowed",
                position: "relative",
                transition: "all 0.19s"
              }}
              aria-dropeffect={droppedIdx === null && !showFeedback ? "move" : "none"}
            >
              {renderPoster(movie)}
              <div
                style={{
                  fontWeight: 600,
                  color: "#fff",
                  fontSize: "1.1rem",
                  letterSpacing: ".007em",
                  textAlign: "center"
                }}
              >
                {movie.title}
              </div>
              {droppedIdx === idx && showFeedback && (
                <div style={{
                  color: idx === round.correctIdx ? "#29c777" : "#ff8f55",
                  fontWeight: 600,
                  marginTop: 8,
                  background: "#180523e5",
                  borderRadius: 8,
                  padding: "6px 13px",
                  boxShadow: "0 0 10px #fb00ff44",
                  fontSize: "1rem",
                  minHeight: 22,
                }}>
                  {idx === round.correctIdx
                    ? "Correct! This is a Vetrimaaran movie."
                    : `"${movie.title}" is not a Vetrimaaran film.`}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* FEEDBACK Summary */}
        <div style={{ marginTop: 16, minHeight: 28, textAlign: "center" }}>
          {showFeedback && droppedIdx !== null && (
            <span style={{
              color: droppedIdx === round.correctIdx ? "#29c777" : "#fb00ff",
              fontWeight: 500,
              fontSize: "1.13rem"
            }}>
              {droppedIdx === round.correctIdx
                ? "Correct! Advancing to next..."
                : `Nope! "${round.options[droppedIdx]?.title}" isn't correct.`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CharacterMovieMatch;
