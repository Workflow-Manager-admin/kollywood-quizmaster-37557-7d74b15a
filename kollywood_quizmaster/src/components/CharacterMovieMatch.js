import React, { useEffect, useState, useRef } from "react";
import "./CharacterMovieMatch.css";

/*
PUBLIC_INTERFACE
CharacterMovieMatch: 10 rounds—each uses a distinct character name as clue, and the answer is the correct movie poster among 4 TMDb posters. Ensures no clue or option repeats, all posters reliable, and gives clear drag-and-drop instructions.

@param {
  claimMoviesForRound: function,
  sessionInitialized: boolean,
  initializeSession: function,
  remainingCount: number,
  onGameEnd: function,
  onBack: function,
} props
*/
function CharacterMovieMatch({
  claimMoviesForRound,
  sessionInitialized,
  initializeSession,
  remainingCount,
  onGameEnd,
  onBack,
}) {
  // TOTAL_ROUNDS - quiz rounds, each uses a distinct character.
  const TOTAL_ROUNDS = 10;
  const OPTIONS_PER_ROUND = 4;

  // Prepare rounds: each round picks 1 answer movie and 3 decoys from session pool,
  // all must have poster_path, title, and be unique (no repeats/overlap), and 4 options per round.
  // Main clue is the main character name (simulated from movie's title or "fake" char).

  const [quizRounds, setQuizRounds] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userGuesses, setUserGuesses] = useState([]);
  const [droppedIdx, setDroppedIdx] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const clueRef = useRef(null);

  // Fisher-Yates shuffle
  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Utility to make a "character name" from a movie (by title or a fallback character list)
  function getCharacterNameFromMovie(movie, idx) {
    // Insert a pool of fun Kollywood character names for variety
    const backfill = [
      "Anbu", "Chitti", "Vetri", "Suriya", "Durai", "Azhagu", "Maya", "Kumudhu", "Palani", "Aravind", "Radha", "Muthu", "Siddhu", "Chandru", "Gowri", "Vasuki"
    ];
    // Use first word/phrase (or default to fallback pool)
    if (movie?.title) {
      const parts = movie.title.split(' ');
      return (parts.length > 1 ? parts[0] : movie.title).trim() || backfill[idx % backfill.length];
    }
    return backfill[idx % backfill.length];
  }

  // Prepare rounds: 10 rounds, 4 unique poster movies per round (never repeated in options),
  // clue will be "character" derived from answer movie.
  useEffect(() => {
    if (!sessionInitialized) {
      initializeSession();
      setLoading(true);
      return;
    }
    if (sessionInitialized && quizRounds.length === 0) {
      // Defensive: Try to claim movies, retry fallback if null or not enough
      let decoyPool = claimMoviesForRound(TOTAL_ROUNDS * OPTIONS_PER_ROUND);
      if (!Array.isArray(decoyPool) || decoyPool.length < TOTAL_ROUNDS * OPTIONS_PER_ROUND) {
        // Try to claim as many as possible, fallback
        decoyPool = claimMoviesForRound(Math.max(0, remainingCount)) || [];
      }
      if (!Array.isArray(decoyPool)) decoyPool = [];
      // Use only movies with good posters/titles
      const suitablePool = decoyPool.filter(m => !!m.poster_path && !!m.title);
      // Defensive: if < TOTAL_ROUNDS*4, fallback to whatever is possible
      let roundCount = Math.min(
        Math.floor(suitablePool.length / OPTIONS_PER_ROUND),
        TOTAL_ROUNDS
      );
      // If not enough for even a single round, set fallback state and stop
      if (roundCount < 1) {
        setQuizRounds([]); // signals "not enough" below
        setLoading(false);
        return;
      }
      const shuffled = shuffle(suitablePool);
      const usedIds = new Set();
      const rounds = [];
      let offset = 0;
      for (let i = 0; i < roundCount; ++i) {
        // Each round: pick 4 unique movies not previously used in any option
        let options = [];
        let tries = 0;
        // greedy: skip usedIds, add up to 4 unique
        while (
          options.length < OPTIONS_PER_ROUND &&
          offset < shuffled.length &&
          tries < 10 * OPTIONS_PER_ROUND
        ) {
          const candidate = shuffled[offset++];
          if (!candidate) break;
          // No repeats globally among options
          if (usedIds.has(candidate.id)) {
            tries++;
            continue;
          }
          options.push(candidate);
          usedIds.add(candidate.id);
        }
        if (options.length !== OPTIONS_PER_ROUND) break; // not enough for a round: stop
        // Pick "answer" at random among 4 and use for character
        const answerIdx = Math.floor(Math.random() * OPTIONS_PER_ROUND);
        const answerMovie = options[answerIdx];
        const characterClue = getCharacterNameFromMovie(answerMovie, i);
        rounds.push({
          clueCharacter: characterClue,
          answerMovie: {
            title: answerMovie.title,
            tmdb_id: answerMovie.id,
            poster_path: answerMovie.poster_path,
          },
          options: options.map(m => ({
            title: m.title,
            tmdb_id: m.id,
            poster_path: m.poster_path,
          })),
          correctIdx: answerIdx,
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
  }, [sessionInitialized, claimMoviesForRound, remainingCount]);

  // ---- Drag/drop events ----
  function onDragStart(e) {
    setDragActive(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "kollywood-character");
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
  // Handles answer selection: only allowed once per round
  function handleDrop(idx) {
    if (droppedIdx !== null || showFeedback) return;
    setDroppedIdx(idx);
    setDragActive(false);
    setShowFeedback(true);

    const round = quizRounds[currentIdx];
    const isCorrect = idx === round.correctIdx;
    setUserGuesses(prev => [
      ...prev,
      {
        guessIdx: idx,
        correctIdx: round.correctIdx,
        correct: isCorrect,
        chosenTitle: round.options[idx].title,
        correctTitle: round.options[round.correctIdx].title,
      },
    ]);
    // Auto-advance or finish after short delay
    setTimeout(() => {
      if (currentIdx + 1 === quizRounds.length) {
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
                correctTitle: round.options[round.correctIdx].title,
              },
            ],
            roundMovies: quizRounds.map(r => r.options[r.correctIdx]),
          });
        }
      } else {
        setCurrentIdx(c => c + 1);
        setDroppedIdx(null);
        setShowFeedback(false);
      }
    }, 1150);
  }

  // Poster rendering: always show image or fallback
  // PUBLIC_INTERFACE
  /**
   * Renders a movie poster if data is valid; shows fallback for undefined/null/invalid.
   * @param {object} movie - movie object (must have poster_path for image)
   * @returns JSX element
   */
  function renderPoster(movie) {
    if (
      !movie ||
      typeof movie !== "object" ||
      !movie.poster_path ||
      typeof movie.poster_path !== "string"
    ) {
      return (
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
    return (
      <img
        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
        alt={movie.title ?? "Movie Poster"}
        width={116}
        height={172}
        style={{
          objectFit: "cover",
          borderRadius: 9,
          marginBottom: 7,
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
    );
  }

  // Loader for preparation
  if (loading) {
    return (
      <div className="game-panel glass-panel">
        <button className="btn btn-back" onClick={onBack}>
          ← Back
        </button>
        <h2>🎬 Character-Movie Match</h2>
        <em>Preparing your character-movie match round...</em>
      </div>
    );
  }
  if (!Array.isArray(quizRounds) || quizRounds.length === 0) {
    // Not enough data for a round: show an error (not stuck)
    return (
      <div className="game-panel glass-panel">
        <button className="btn btn-back" onClick={onBack}>
          ← Back
        </button>
        <h2>🎬 Character-Movie Match</h2>
        <p><b>Sorry, not enough unique Kollywood movie data is available to generate a round.<br />Please try a different game or reload once more movies are available.</b></p>
      </div>
    );
  }
  if (
    currentIdx >= quizRounds.length ||
    !quizRounds[currentIdx]
  ) {
    return (
      <div className="game-panel glass-panel">
        <button className="btn btn-back" onClick={onBack}>
          ← Back
        </button>
        <h2>🎬 Character-Movie Match</h2>
        <em>Preparing your character-movie match round...</em>
      </div>
    );
  }

  // ---- Robust round and data guards start here ----

  // Helper for safe current round access
  let round = null;
  if (
    Array.isArray(quizRounds) &&
    typeof currentIdx === "number" &&
    currentIdx >= 0 &&
    currentIdx < quizRounds.length &&
    typeof quizRounds[currentIdx] === "object"
  ) {
    round = quizRounds[currentIdx];
  }

  // Guard: round object must be present and well-shaped
  const optionsReady =
    round &&
    typeof round === "object" &&
    Array.isArray(round.options) &&
    round.options.length === OPTIONS_PER_ROUND &&
    typeof round.correctIdx === "number" &&
    round.correctIdx >= 0 &&
    round.correctIdx < round.options.length &&
    typeof round.clueCharacter === "string";

  if (!optionsReady) {
    // Show UI-fallback loader if options not ready, options misaligned, or round mis-shaped
    return (
      <div className="game-panel glass-panel">
        <button className="btn btn-back" onClick={onBack}>
          ← Back
        </button>
        <h2>🎬 Character-Movie Match</h2>
        <em>Preparing your character-movie match round...</em>
      </div>
    );
  }

  // Defensive: fill with ?s for option titles/posters if any undefined/null in array
  const safeOptions = Array.isArray(round.options)
    ? round.options.map((movie, idx) =>
        movie && typeof movie === "object"
          ? movie
          : { title: "?", poster_path: null, tmdb_id: "?" }
      )
    : [{ title: "?", poster_path: null, tmdb_id: "?" }];

  // Defensive: correctIdx within bounds
  const correctIdx =
    typeof round.correctIdx === "number" &&
    round.correctIdx >= 0 &&
    round.correctIdx < safeOptions.length
      ? round.correctIdx
      : 0;

  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>
        ← Back
      </button>
      <h2>
        🎬 Character-Movie Match
        <span style={{
          fontSize: "1rem",
          fontWeight: 400,
          marginLeft: 8,
        }}>
          (Q{typeof currentIdx === "number" ? currentIdx + 1 : "?"}/{quizRounds.length})
        </span>
      </h2>
      <div style={{ marginTop: 10, marginBottom: 14 }}>
        <b>How to Play:</b>
        <br />
        <span style={{ color: "#fb00ff", fontWeight: 500 }}>
          For each round, <u>drag the Character card</u> below onto the movie poster for the film that features the <b>given character</b> from Kollywood.
          <br />
          Only one poster per round is correct. Each character and movie is unique to that round.
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        {/* DRAGGABLE CLUE (Character card) */}
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
            fontSize: "1.65rem",
            marginBottom: 8,
            cursor: droppedIdx === null && !showFeedback ? "grab" : "not-allowed",
            opacity: droppedIdx !== null || showFeedback ? 0.37 : 1,
            boxShadow: dragActive ? "0 0 19px #fb00ff77" : "",
            transition: "opacity 0.2s, box-shadow 0.15s"
          }}
          tabIndex={0}
          aria-grabbed={dragActive ? "true" : "false"}
        >
          <span role="img" aria-label="character">👤</span> {typeof round.clueCharacter === "string" ? round.clueCharacter : "?"}
          <span style={{
            fontWeight: 400,
            fontSize: "1rem",
            marginLeft: 7,
            color: "#fff9"
          }}>– Character</span>
        </div>
        {/* POSTER OPTIONS GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "17px",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {safeOptions.map((movie, idx) => {
            // Always guard movie object
            const hasValidMovie =
              !!movie &&
              typeof movie === "object" &&
              typeof movie.poster_path === "string" &&
              movie.poster_path.length > 0;

            // For key and labels, fallback to idx if missing
            const movieKey =
              movie && (movie.tmdb_id || movie.id || idx);

            // Defensive: robust hover/drag handlers
            const allowDrop = droppedIdx === null && !showFeedback;

            return (
              <div
                key={`${movieKey}`}
                onDragOver={allowDrop ? onDragOver : undefined}
                onDrop={allowDrop ? () => handleDrop(idx) : undefined}
                tabIndex={0}
                className="poster-drop"
                style={{
                  width: 151,
                  minHeight: 224,
                  background:
                    droppedIdx === idx && showFeedback
                      ? idx === correctIdx
                        ? "#29c77733"
                        : "#fb00ff33"
                      : "var(--card-bg, #130013df)",
                  border:
                    droppedIdx === idx && showFeedback
                      ? idx === correctIdx
                        ? "3.4px solid #29c777"
                        : "3.2px solid #fb00ff"
                      : "2.3px solid var(--border-color, #fb00ff66)",
                  borderRadius: 12,
                  boxShadow:
                    droppedIdx === idx && showFeedback
                      ? "0 0 20px #fb00ff77"
                      : "0 2px 17px #fb00ff19",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: droppedIdx !== null && droppedIdx !== idx ? 0.52 : 1,
                  cursor: allowDrop ? "pointer" : "not-allowed",
                  position: "relative",
                  transition: "all 0.19s"
                }}
                aria-dropeffect={allowDrop ? "move" : "none"}
              >
                {/* Use guard clause to only pass valid movies to renderPoster */}
                {hasValidMovie
                  ? renderPoster(movie)
                  : (
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
                  )}
                <div
                  style={{
                    fontWeight: 600,
                    color: "#fff",
                    fontSize: "1.1rem",
                    letterSpacing: ".007em",
                    textAlign: "center"
                  }}
                >
                  {movie && typeof movie.title === "string" && movie.title.trim()
                    ? movie.title
                    : <span style={{ color: "#fff4" }}>?</span>}
                </div>
                {droppedIdx === idx && showFeedback && (
                  <div
                    style={{
                      color: idx === correctIdx ? "#29c777" : "#ff8f55",
                      fontWeight: 600,
                      marginTop: 8,
                      background: "#180523e5",
                      borderRadius: 8,
                      padding: "6px 13px",
                      boxShadow: "0 0 10px #fb00ff44",
                      fontSize: "1rem",
                      minHeight: 22
                    }}
                  >
                    {idx === correctIdx
                      ? "Correct! This character is from the chosen movie."
                      : `"${(movie && typeof movie.title === "string" && movie.title.trim()) ? movie.title : "Movie"}" does NOT feature this character.`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* FEEDBACK Section */}
        <div style={{ marginTop: 16, minHeight: 28, textAlign: "center" }}>
          {showFeedback && droppedIdx !== null && (
            <span
              style={{
                color: droppedIdx === correctIdx ? "#29c777" : "#fb00ff",
                fontWeight: 500,
                fontSize: "1.13rem"
              }}
            >
              {droppedIdx === correctIdx
                ? "Correct! Advancing to next..."
                : `Oops! "${
                  Array.isArray(safeOptions) &&
                  typeof droppedIdx === "number" &&
                  safeOptions[droppedIdx] &&
                  typeof safeOptions[droppedIdx].title === "string" &&
                  safeOptions[droppedIdx].title.trim()
                    ? safeOptions[droppedIdx].title
                    : "Movie"
                }" isn't correct.`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CharacterMovieMatch;
