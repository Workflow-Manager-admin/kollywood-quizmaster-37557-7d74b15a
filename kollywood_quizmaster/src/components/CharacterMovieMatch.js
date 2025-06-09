import React, { useEffect, useState, useRef } from "react";
import "./CharacterMovieMatch.css";

// PUBLIC_INTERFACE
/**
 * CharacterMovieMatch: Each round, user matches a "character" clue ("Vetrimaaran") to the correct movie
 * poster using drag-and-drop. Poster images always use TMDb's poster_path, and drag-and-drop
 * remains robust. The clue is never a director, only "Vetrimaaran" the character.
 *
 * Expects:
 *   - claimMoviesForRound(n), sessionInitialized, initializeSession by MovieSessionContext (App.js)
 *   - onBack, onGameEnd for navigation/results
 */
function CharacterMovieMatch({
  claimMoviesForRound,
  sessionInitialized,
  initializeSession,
  remainingCount,
  onGameEnd,
  onBack,
}) {
  const TOTAL_ROUNDS = 10;
  const OPTIONS_PER_ROUND = 4;
  const CLUE = "Vetrimaaran";

  // States
  const [roundMovies, setRoundMovies] = useState([]);
  const [rounds, setRounds] = useState([]); // Array of { options: [movieObj], correctIdx, answerIdx, feedback }
  const [currentRound, setCurrentRound] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  // Drag-and-drop
  const [dragActive, setDragActive] = useState(false);
  const [droppedIdx, setDroppedIdx] = useState(null);
  const clueRef = useRef(null);

  // Quiz session setup: each round's correct answer is always "character: Vetrimaaran"
  useEffect(() => {
    if (!sessionInitialized) {
      initializeSession();
      setLoading(true);
      return;
    }
    if (sessionInitialized && roundMovies.length === 0) {
      // Grab enough movies for fake options pool
      const claimed = claimMoviesForRound(TOTAL_ROUNDS * 2);
      if (claimed && claimed.length >= TOTAL_ROUNDS) {
        setRoundMovies(claimed);
      }
    }
    // eslint-disable-next-line
  }, [sessionInitialized, claimMoviesForRound]);

  useEffect(() => {
    if (roundMovies.length === 0) {
      setLoading(true);
      return;
    }
    // Hardcoded "movies for the character Vetrimaaran"
    const vetrimaaranCharacterMovies = [
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
        title: "Vetrimaaran Antha Padichava",
        tmdb_id: 113710,
        poster_path: ""
      }
    ];

    // Shuffle and pick unique corrects for this game round
    const corrects = vetrimaaranCharacterMovies
      .sort(() => Math.random() - 0.5)
      .slice(0, TOTAL_ROUNDS);

    // Build each round
    const roundsBuilt = [];
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      const correctMovie = { ...corrects[i], character: CLUE };
      // Decoys: strictly not the correct, must have poster_path
      const notCorrect = roundMovies
        .filter(m => String(m.id) !== String(correctMovie.tmdb_id))
        .filter(m => m.poster_path);
      const decoys = shuffle(notCorrect).slice(0, 3).map(m => ({
        title: m.title,
        tmdb_id: m.id,
        poster_path: m.poster_path
      }));
      const insertAt = Math.floor(Math.random() * 4);
      const options = [...decoys];
      options.splice(insertAt, 0, correctMovie);
      roundsBuilt.push({
        options,
        correctIdx: insertAt,
        answerIdx: null,
        feedback: ""
      });
    }
    setRounds(roundsBuilt);
    setLoading(false);
    setCurrentRound(0);
    setUserAnswers([]);
    setShowFeedback(false);
    setGameFinished(false);
    setDroppedIdx(null);
    // eslint-disable-next-line
  }, [roundMovies]);

  // Drag handlers for the clue
  function onDragStart(e) {
    setDragActive(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", CLUE);
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
    if (droppedIdx !== null || showFeedback || gameFinished) return;
    setDroppedIdx(idx);
    setDragActive(false);

    const round = rounds[currentRound];
    const isCorrect = idx === round.correctIdx;
    let feedback;
    if (isCorrect) {
      feedback = "Correct! This movie fits the Vetrimaaran clue.";
    } else {
      feedback = `Incorrect. "${round.options[idx].title}" was not the right answer.`;
    }

    const newRounds = rounds.slice();
    newRounds[currentRound] = {
      ...round,
      answerIdx: idx,
      feedback
    };
    setRounds(newRounds);
    setUserAnswers(ans => ans.concat({
      guess: idx,
      correct: isCorrect,
      chosenTitle: round.options[idx]?.title,
      correctTitle: round.options[round.correctIdx]?.title
    }));
    setShowFeedback(true);

    setTimeout(() => {
      if (currentRound + 1 === TOTAL_ROUNDS) {
        setGameFinished(true);
        // End of game! Push to results page immediately
        if (onGameEnd) {
          onGameEnd({
            correct: [...(userAnswers || []), { correct: isCorrect }].filter(x => x.correct).length,
            total: TOTAL_ROUNDS,
            mode: "Character-Movie Match (Vetrimaaran)",
            answers: [...(userAnswers || []), { guess: idx, correct: isCorrect }],
            roundMovies: rounds.map(r => r.options[r.correctIdx])
          });
        }
      } else {
        setShowFeedback(false);
        setDroppedIdx(null);
        setCurrentRound(c => c + 1);
      }
    }, 1600);
  }

  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Robust poster UI – fallback to placeholder, never broken/broken link
  function renderPoster(movie) {
    return movie.poster_path
      ? (
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
            width: 116, height: 172, background: "#201426",
            color: "#fff6", borderRadius: 9, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 16, marginBottom: 7
          }}
        >No Poster</div>
      );
  }

  // Wait for rounds to be built
  if (loading || rounds.length === 0 || currentRound >= rounds.length) {
    return (
      <div className="game-panel glass-panel">
        <button className="btn btn-back" onClick={onBack}>← Back</button>
        <h2>🎬 Character-Movie Match <span style={{ fontSize: "1rem", fontWeight: 400 }}>({CLUE})</span></h2>
        <em>Preparing your character-movie match round...</em>
      </div>
    );
  }

  const round = rounds[currentRound] || {};
  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>
        🎬 Character-Movie Match
        <span style={{
          fontSize: "1rem",
          fontWeight: 400,
          marginLeft: 8
        }}>(Q{currentRound + 1}/{TOTAL_ROUNDS})</span>
      </h2>
      <div style={{ marginTop: 10, marginBottom: 14 }}>
        <b>Instructions:</b><br />
        <span style={{ color: "#fb00ff" }}>
          Drag the <b>character clue</b> "<b>{CLUE}</b>" onto the movie poster that <br />
          you believe matches the given character.<br />
          All clues represent only the character "Vetrimaaran".
        </span>
      </div>
      {/* Draggable clue */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div
          ref={clueRef}
          draggable={droppedIdx === null && !showFeedback && !gameFinished}
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
            cursor: droppedIdx === null && !showFeedback && !gameFinished ? "grab" : "not-allowed",
            opacity: droppedIdx !== null || showFeedback ? 0.35 : 1,
            boxShadow: dragActive ? "0 0 19px #fb00ff77" : "",
            transition: "opacity 0.2s, box-shadow 0.15s"
          }}
          tabIndex={0}
          aria-grabbed={dragActive ? "true" : "false"}
        >
          {CLUE}
          <span style={{
            fontWeight: 400,
            fontSize: "1rem",
            marginLeft: 7,
            color: "#fff9"
          }}>Character</span>
        </div>
        {/* Options/panels */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "17px",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {round.options &&
            round.options.map((movie, idx) => (
              <div
                key={movie.tmdb_id + "-" + idx}
                onDragOver={droppedIdx === null && !showFeedback && !gameFinished ? onDragOver : undefined}
                onDrop={droppedIdx === null && !showFeedback && !gameFinished ? () => onDrop(idx) : undefined}
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
                  cursor: droppedIdx === null && !showFeedback && !gameFinished ? "pointer" : "not-allowed",
                  position: "relative",
                  transition: "all 0.19s"
                }}
                aria-dropeffect={droppedIdx === null && !showFeedback && !gameFinished ? "move" : "none"}
              >
                {renderPoster(movie)}
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
                    {round.feedback}
                  </div>
                )}
              </div>
            ))}
        </div>
        <div style={{ marginTop: 16, minHeight: 28, textAlign: "center" }}>
          {showFeedback && droppedIdx !== null && (
            <span style={{
              color: droppedIdx === round.correctIdx ? "#29c777" : "#fb00ff",
              fontWeight: 500,
              fontSize: "1.13rem"
            }}>{round.feedback}</span>
          )}
        </div>
        {gameFinished && (
          <div style={{ marginTop: 28 }}>
            <b>End of Round!</b>
          </div>
        )}
      </div>
    </div>
  );
}

export default CharacterMovieMatch;
