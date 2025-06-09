import React, { useState, useEffect } from "react";
import './BlurredPosterGuess.css';

/**
 * Blurred Poster Guess mode - implemented with unique, non-repeating movies from MovieSessionContext.
 * @param {Object} props
 */
function BlurredPosterGuess({
  claimMoviesForRound,
  sessionInitialized,
  initializeSession,
  remainingCount,
  onGameEnd,
  onBack,
}) {
  // One round: 10 questions (10 movies, no repeats)
  const TOTAL_ROUNDS = 10;
  const [roundMovies, setRoundMovies] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userGuesses, setUserGuesses] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // Setup session and claim unique movies for this round
  useEffect(() => {
    if (!sessionInitialized) {
      initializeSession();
    }
    // Only claim movies if not yet set
    if (sessionInitialized && roundMovies.length === 0) {
      const claimed = claimMoviesForRound(TOTAL_ROUNDS);
      if (claimed && claimed.length === TOTAL_ROUNDS) {
        setRoundMovies(claimed);
      } else {
        // Not enough unique movies, end with unavailable
        setRoundMovies([]);
      }
    }
    // eslint-disable-next-line
  }, [sessionInitialized, claimMoviesForRound]);

  // Handle guess submissions
  function handleGuess(submittedTitle) {
    setUserGuesses(prev =>
      prev.concat({ guess: submittedTitle, correct: submittedTitle.toLowerCase() === roundMovies[currentIdx].title.toLowerCase() })
    );
    setShowAnswer(true);
  }

  // Proceed to next question or finish
  function nextQuestion() {
    if (currentIdx + 1 < roundMovies.length) {
      setCurrentIdx(currentIdx + 1);
      setShowAnswer(false);
    } else {
      // Game over: calculate result and signal end
      const correct = userGuesses.filter(g => g.correct).length + (showAnswer && userGuesses.length < roundMovies.length
        ? 0 : 0); // if last answer not submitted, show partial
      onGameEnd({
        correct,
        total: roundMovies.length,
        mode: "Blurred Poster Guess",
        roundMovies,
        answers: userGuesses,
      });
    }
  }

  // Loading and fallback states
  if (roundMovies.length === 0 && (remainingCount === undefined || remainingCount >= TOTAL_ROUNDS)) {
    return (
      <div className="game-panel glass-panel">
        <button className="btn btn-back" onClick={onBack}>← Back</button>
        <h2>🖼️ Blurred Poster Guess</h2>
        <em>Preparing your quiz round...</em>
      </div>
    );
  }

  if (roundMovies.length === 0) {
    // Not enough movies!
    return (
      <div className="game-panel glass-panel">
        <button className="btn btn-back" onClick={onBack}>← Back</button>
        <h2>🖼️ Blurred Poster Guess</h2>
        <p><b>Sorry, not enough unique movies left for a full round.</b></p>
      </div>
    );
  }

  const movie = roundMovies[currentIdx];
  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>🖼️ Blurred Poster Guess <span style={{ fontSize: "1rem", fontWeight: 400 }}>(Q{currentIdx + 1}/{roundMovies.length})</span></h2>
      <div>
        <div>
          {/* Poster image, blurred */}
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
              style={{
                filter: 'blur(10px) saturate(0.7)',
                borderRadius: "12px",
                width: '220px',
                boxShadow: "0 0 20px #fb00ff55"
              }}
              alt="Blurred movie poster"
            />
          ) : <div style={{
            background: '#222',
            width: '220px',
            height: '330px',
            borderRadius: "12px",
            display: 'flex', alignItems:'center',justifyContent:'center',
            color:'#aaa'}}>No Poster</div>}
          <div style={{ marginTop: 10, opacity: .8 }}>
            <em>Clue 1:</em> Release Year: <b>{movie.release_date?.substring(0, 4) ?? "Unknown"}</b>
            <br />
            <em>Clue 2:</em> Popularity: <b>{Math.round(movie.popularity)}</b>
          </div>
        </div>
        <br />
        {!showAnswer ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              const guess = e.target.elements.movieGuess.value;
              if (guess && guess.length >= 2) {
                handleGuess(guess);
              }
            }}
            style={{display:'flex', flexDirection:'column', gap:10, alignItems:'center'}}
          >
            <input
              type="text"
              name="movieGuess"
              placeholder="Your Guess (movie title)"
              minLength={2}
              required
              autoFocus
              style={{
                fontSize: '1.08rem', padding: '7px 12px', borderRadius:'6px',
                width: '210px', background:'#20052a', color:'#fff', border:'1px solid var(--border-color)'
              }}
            />
            <button className="btn" type="submit">Submit Guess</button>
            <button type="button" className="btn" style={{background:"#222",color:"#fb00ff"}}
              onClick={() => setShowAnswer(true)}>
              Reveal Answer
            </button>
          </form>
        ) : (
          <div>
            <div>
              <strong>Answer:</strong> <span style={{color:"#fb00ff", letterSpacing:".01em"}}>{movie.title}</span>
              <br/>
              {(userGuesses[currentIdx] && userGuesses[currentIdx].guess) &&
                <span>
                  Your guess: <b>{userGuesses[currentIdx].guess}</b>
                  {userGuesses[currentIdx].correct
                    ? <span style={{ color: 'limegreen', marginLeft:6 }}>✓ Correct!</span>
                    : <span style={{ color: "#fa0", marginLeft:6 }}>✗ Incorrect</span>
                  }
                </span>
              }
            </div>
            <button className="btn" onClick={nextQuestion} style={{marginTop:12}}>
              {currentIdx+1 === roundMovies.length ? "Finish Round" : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlurredPosterGuess;
