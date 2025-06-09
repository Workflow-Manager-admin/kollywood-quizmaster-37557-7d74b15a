import React, { useEffect, useState } from "react";
import './CastCombo.css';

/**
 * Cast Combo: Guess the movie by given combo of fake "cast" (from title words)
 * Bonus reverse mode: Pick the NOT-in-movie fake actor.
 */
function CastCombo({
  claimMoviesForRound,
  sessionInitialized,
  initializeSession,
  remainingCount,
  onGameEnd,
  onBack,
}) {
  const TOTAL_ROUNDS = 10;
  const [roundMovies, setRoundMovies] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [reverseMode, setReverseMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // HOOKS absolutely first after state
  useEffect(() => {
    if (!sessionInitialized) initializeSession();
    if (sessionInitialized && roundMovies.length === 0) {
      const claimed = claimMoviesForRound(TOTAL_ROUNDS);
      if (claimed && claimed.length === TOTAL_ROUNDS) {
        setRoundMovies(claimed);
      }
    }
    // eslint-disable-next-line
  }, [sessionInitialized, claimMoviesForRound]);

  useEffect(() => {
    if (showAnswer && roundMovies.length > 0) {
      const timer = setTimeout(() => {
        nextQuestion();
      }, 1100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [showAnswer, roundMovies.length, currentIdx]);

  // After all hooks, early return for loading
  if (roundMovies.length === 0) {
    return (
      <div className="game-panel glass-panel">
        <button className="btn btn-back" onClick={onBack}>← Back</button>
        <h2>👥 Cast Combo</h2>
        <em>Building your cast combo round...</em>
      </div>
    );
  }

  // Below: variables for the game step
  const movie = roundMovies[currentIdx];
  // Simulate "cast" as first three words of title (fallback to random words)
  const castWords = (movie.title || "Combo One Two").split(" ").slice(0, 3);
  // In reverse mode: add one word NOT in cast
  let options = [...castWords];
  let odd = "";
  if (reverseMode) {
    // Pick a fake word not in cast
    odd = "Singam";
    if (!castWords.includes("Singam")) {
      options = options.concat([odd]);
    } else {
      options = options.concat(["Raja"]);
      odd = "Raja";
    }
    options = shuffle(options);
  }

  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function submitGuess(guess) {
    if (!reverseMode) {
      setUserAnswers(prev =>
        prev.concat({ guess, correct: guess.toLowerCase() === movie.title.toLowerCase() })
      );
    } else {
      setUserAnswers(prev =>
        prev.concat({ guess, correct: guess === odd })
      );
    }
    setShowAnswer(true);
  }

  function nextQuestion() {
    if (currentIdx + 1 < roundMovies.length) {
      setCurrentIdx(currentIdx + 1);
      setReverseMode((currentIdx + 1) % 2 === 1); // Alternate mode each question
      setShowAnswer(false);
    } else {
      const correct = userAnswers.filter(g => g.correct).length;
      onGameEnd({
        correct,
        total: roundMovies.length,
        mode: "Cast Combo",
        roundMovies,
        answers: userAnswers,
      });
    }
  }

  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>👥 Cast Combo <span style={{ fontSize: "1rem", fontWeight: 400 }}>(Q{currentIdx + 1}/{roundMovies.length})</span></h2>
      <div>
        {!reverseMode ? (
          <div>
            <b>Guess the movie from the "cast":</b>
            <span style={{ display: 'inline-block', marginLeft: 7, color: "#fb00ff" }}>{castWords.join(", ")}</span>
            <br /><br />
            {!showAnswer ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  submitGuess(e.target.elements.guess.value);
                }}
                style={{ display: 'flex', gap: 7, flexDirection: 'column', alignItems: 'center' }}
              >
                <input name="guess" type="text" required placeholder="Enter movie title"
                  style={{
                    fontSize: '1.09rem', padding: '7px 10px', borderRadius: '6px',
                    background: '#20052a', color: '#fff', border: '1px solid var(--border-color)', width: '210px'
                  }}
                />
                <button className="btn" type="submit">Submit</button>
                <button className="btn" type="button" style={{ background: "#222", color: "#fb00ff" }} onClick={() => setShowAnswer(true)}>
                  Reveal Answer
                </button>
              </form>
            ) : (
              <div>
                <strong>Correct movie:</strong> <span style={{ color: '#fb00ff' }}>{movie.title}</span>
                {(userAnswers[currentIdx] && userAnswers[currentIdx].guess) &&
                  <div>
                    Your answer: <b>{userAnswers[currentIdx].guess}</b>
                    {userAnswers[currentIdx].correct
                      ? <span style={{ color: "limegreen", marginLeft: 6 }}>✓ Correct!</span>
                      : <span style={{ color: "#fa0", marginLeft: 6 }}>✗ Incorrect</span>
                    }
                  </div>
                }
                <button className="btn" style={{ marginTop: 11 }} onClick={nextQuestion}>
                  {currentIdx + 1 === roundMovies.length ? "Finish Round" : "Next"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <b>Reverse: Which actor/actress was <span style={{ color: '#fb00ff' }}>NOT</span> in <u>{movie.title}</u>?</b>
            <br /><br />
            {!showAnswer ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  submitGuess(e.target.elements.odd.value);
                }}
                style={{ display: 'flex', gap: 9, flexDirection: 'column', alignItems: 'center' }}
              >
                {options.map((actor, idx) =>
                  <label key={actor} style={{
                    background: "#20052a", color: '#fff', padding: '6px 14px', margin: '3px 0',
                    borderRadius: '5px', display: 'inline-block', cursor: 'pointer'
                  }}>
                    <input type="radio" name="odd" required value={actor} style={{ marginRight: 7 }} />
                    {actor}
                  </label>
                )}
                <button className="btn" type="submit" style={{ marginTop: 6 }}>Submit</button>
                <button className="btn" type="button" style={{ background: "#222", color: "#fb00ff" }} onClick={() => setShowAnswer(true)}>
                  Reveal Answer
                </button>
              </form>
            ) : (
              <div>
                <b>The odd-one-out was:</b> <span style={{ color: '#fb00ff' }}>{odd}</span>
                {(userAnswers[currentIdx] && userAnswers[currentIdx].guess) &&
                  <div>
                    You picked: <b>{userAnswers[currentIdx].guess}</b>
                    {userAnswers[currentIdx].correct
                      ? <span style={{ color: "limegreen", marginLeft: 6 }}>✓ Correct!</span>
                      : <span style={{ color: "#fa0", marginLeft: 6 }}>✗ Incorrect</span>
                    }
                  </div>
                }
                <button className="btn" style={{ marginTop: 11 }} onClick={nextQuestion}>
                  {currentIdx + 1 === roundMovies.length ? "Finish Round" : "Next"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CastCombo;
