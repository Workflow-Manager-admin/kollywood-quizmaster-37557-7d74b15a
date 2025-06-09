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

  // The character/movie pairs: Each pair has a distinct character as clue, and the answer is the movie.
  // All movies must have a valid TMDb poster_path.
  // For production, this data should be fetched or extended with a larger varied data set.
  // For this exercise, we'll use actual major Kollywood character/movie/poster triples, stable for quiz use.
  // List: [{ character, movieTitle, tmdb_id, poster_path }]
  const CHARACTER_MOVIE_PAIRS = [
    { character: "Anbu",         movieTitle: "Vada Chennai",       tmdb_id: 470926, poster_path: "/8HVGjzxubAEANMQggqRAsoe5nBr.jpg" },
    { character: "Chandran",     movieTitle: "Aadukalam",          tmdb_id: 54858, poster_path: "/4g4sb7TAtrtpemTq9iAXTh9tPfB.jpg" },
    { character: "Anbuchelvan",  movieTitle: "Kaakha Kaakha",      tmdb_id: 37763, poster_path: "/psHbntkwqU8jqMo0QXVAw3WyFs7.jpg" },
    { character: "Suriya",       movieTitle: "Pithamagan",         tmdb_id: 46344, poster_path: "/2uf9KimGVDHdvHGWibqx7QrQMdL.jpg" },
    { character: "Chitti",       movieTitle: "Enthiran",           tmdb_id: 46346, poster_path: "/zOVxqRfRyHtQABz1NwftbDC11FX.jpg" },
    { character: "Dhanush",      movieTitle: "Maryan",             tmdb_id: 188924, poster_path: "/1OuaJ2DKalTWnvGcCfXyu2Q9tJQ.jpg" },
    { character: "Vetri",        movieTitle: "Polladhavan",        tmdb_id: 77895, poster_path: "/gp02lHgVdibgykjSzDbM9YNQJ1l.jpg" },
    { character: "Samiappan",    movieTitle: "Asuran",             tmdb_id: 573530, poster_path: "/zggcTQEWh05RzTRiXOBCENcyzmO.jpg" },
    { character: "Pudhupettai",  movieTitle: "Pudhupettai",        tmdb_id: 34826, poster_path: "/7DwsS5sz34JEoLNnNm5WYQg2BKy.jpg" },
    { character: "Pandiya",      movieTitle: "Subramaniapuram",    tmdb_id: 58846, poster_path: "/gxFQdK5T4VSj4pS2XLUd5egPtZV.jpg" },
    // More authentic pairs can be added for true diversity, but must guarantee poster_path is present.
  ].filter(m => !!m.poster_path);

  // State: quiz setup, progress, answer tracking
  const [quizRounds, setQuizRounds] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userGuesses, setUserGuesses] = useState([]);
  const [droppedIdx, setDroppedIdx] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const clueRef = useRef(null);

  // Shuffle helper
  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Prepare rounds: each round is a unique character clue, 4 poster movie options (one correct), and no repeats throughout entire quiz session.
  useEffect(() => {
    if (!sessionInitialized) {
      initializeSession();
      setLoading(true);
      return;
    }
    if (sessionInitialized && quizRounds.length === 0) {
      // Claim a big pool of movies for decoys (excluding solution movies by tmdb_id)
      let decoyPool = claimMoviesForRound(TOTAL_ROUNDS * 10) || [];
      if (!Array.isArray(decoyPool)) decoyPool = [];

      // Avoid distractor using solution movies/posters/ids
      const solutionIds = new Set(CHARACTER_MOVIE_PAIRS.map(m => String(m.tmdb_id)));
      decoyPool = decoyPool.filter(m => !!m.poster_path && !!m.title && !solutionIds.has(String(m.id)));

      // Pick TOTAL_ROUNDS unique character/movie pairs from our master list (random, no repeat)
      const clues = shuffle(CHARACTER_MOVIE_PAIRS).slice(0, TOTAL_ROUNDS);
      // Track used posters and movie ids for global repeat avoidance
      const usedPosters = new Set();
      const usedMovieIds = new Set();

      // Each round: build as { clueCharacter, answerMovie, options, correctIdx }
      const rounds = [];
      for (let i = 0; i < clues.length; ++i) {
        const characterClue = clues[i].character;
        const answerMovie = {
          title: clues[i].movieTitle,
          tmdb_id: clues[i].tmdb_id,
          poster_path: clues[i].poster_path,
        };
        usedPosters.add(answerMovie.poster_path);
        usedMovieIds.add(answerMovie.tmdb_id);

        // Find sufficient decoys: unique by movie id/poster, not previously used
        const validDecoys = decoyPool.filter(
          m => !usedPosters.has(m.poster_path) && !usedMovieIds.has(m.id)
        );
        const chosenDecoys = shuffle(validDecoys).slice(0, OPTIONS_PER_ROUND - 1);

        chosenDecoys.forEach(d => {
          usedPosters.add(d.poster_path);
          usedMovieIds.add(d.id);
        });

        // Randomly insert answer among 4 unique options
        const insertAt = Math.floor(Math.random() * OPTIONS_PER_ROUND);
        const options = chosenDecoys.slice();
        options.splice(insertAt, 0, answerMovie);

        rounds.push({
          clueCharacter: characterClue,
          answerMovie,
          options,
          correctIdx: insertAt,
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
  function renderPoster(movie) {
    return movie.poster_path ? (
      <img
        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
        alt={movie.title}
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
          marginBottom: 7,
        }}
      >
        No Poster
      </div>
    );
  }

  // Loader for preparation
  if (
    loading ||
    !Array.isArray(quizRounds) ||
    quizRounds.length === 0 ||
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

  // UI for current round
  const round = quizRounds[currentIdx];
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
        }}>(Q{currentIdx + 1}/{quizRounds.length})</span>
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
          <span role="img" aria-label="character">👤</span> {round.clueCharacter}
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
          {Array.isArray(round.options) &&
            round.options.map((movie, idx) => (
              <div
                key={`${movie && (movie.tmdb_id ?? idx)}`}
                onDragOver={droppedIdx === null && !showFeedback ? onDragOver : undefined}
                onDrop={droppedIdx === null && !showFeedback ? () => handleDrop(idx) : undefined}
                tabIndex={0}
                className="poster-drop"
                style={{
                  width: 151,
                  minHeight: 224,
                  background:
                    droppedIdx === idx && showFeedback
                      ? idx === round.correctIdx
                        ? "#29c77733"
                        : "#fb00ff33"
                      : "var(--card-bg, #130013df)",
                  border:
                    droppedIdx === idx && showFeedback
                      ? idx === round.correctIdx
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
                  cursor: droppedIdx === null && !showFeedback ? "pointer" : "not-allowed",
                  position: "relative",
                  transition: "all 0.19s"
                }}
                aria-dropeffect={droppedIdx === null && !showFeedback ? "move" : "none"}
              >
                {/* Guard all movie property access */}
                {movie ? renderPoster(movie) : (
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
                  {movie && movie.title ? movie.title : <span style={{ color: "#fff4" }}>?</span>}
                </div>
                {droppedIdx === idx && showFeedback && (
                  <div
                    style={{
                      color: idx === round.correctIdx ? "#29c777" : "#ff8f55",
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
                    {idx === round.correctIdx
                      ? "Correct! This character is from the chosen movie."
                      : `"${
                          (movie && movie.title) ? movie.title : "Movie"
                        }" does NOT feature this character.`}
                  </div>
                )}
              </div>
            ))}
        </div>
        {/* FEEDBACK Section */}
        <div style={{ marginTop: 16, minHeight: 28, textAlign: "center" }}>
          {showFeedback && droppedIdx !== null && (
            <span
              style={{
                color: droppedIdx === round.correctIdx ? "#29c777" : "#fb00ff",
                fontWeight: 500,
                fontSize: "1.13rem"
              }}
            >
              {droppedIdx === round.correctIdx
                ? "Correct! Advancing to next..."
                : `Oops! "${
                    (round.options && round.options[droppedIdx] && round.options[droppedIdx].title)
                      ? round.options[droppedIdx].title
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
