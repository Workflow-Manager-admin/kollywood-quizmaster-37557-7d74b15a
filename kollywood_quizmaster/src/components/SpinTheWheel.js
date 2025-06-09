import React, { useState, useEffect } from "react";
import './SpinTheWheel.css';

/**
 * Spin the Wheel mode - use unique movies each round.
 * Randomly "spins" attributes and the player must guess the movie.
 */
function SpinTheWheel({
  claimMoviesForRound,
  sessionInitialized,
  initializeSession,
  remainingCount,
  onGameEnd,
  onBack,
}) {
  const TOTAL_ROUNDS = 10;
  const [roundMovies, setRoundMovies] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // Always call hooks first!
  useEffect(() => {
    if (!sessionInitialized) initializeSession();
    if (sessionInitialized && roundMovies.length === 0) {
      const claimed = claimMoviesForRound(TOTAL_ROUNDS);
      if (claimed && claimed.length === TOTAL_ROUNDS) {
        setRoundMovies(claimed);
        const questionSpins = claimed.map((m, idx) => ({
          year: m.release_date?.substring(0, 4) ?? "????",
          keyword: (idx % 2 === 0 ? "Actor/Actress" : "Theme"),
          clue: (idx % 2 === 0
            ? (m.original_title || m.title).split(' ')[0]
            : (m.overview || "").split(' ')[0] || "Love"
          ),
          answer: m.title
        }));
        setQuestions(questionSpins);
      }
    }
    // eslint-disable-next-line
  }, [sessionInitialized, claimMoviesForRound]);

  useEffect(() => {
    if (showAnswer && questions.length > 0) {
      const timer = setTimeout(() => {
        nextQuestion();
      }, 1100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [showAnswer, questions.length, currentIdx]);

  if (roundMovies.length === 0 || questions.length === 0) {
    return (
      <div className="game-panel glass-panel">
        <button className="btn btn-back" onClick={onBack}>← Back</button>
        <h2>🌀 Spin the Wheel</h2>
        <em>Spinning the wheel for your quiz...</em>
      </div>
    );
  }

  function handleSubmit(guess) {
    setUserAnswers(prev =>
      prev.concat({
        guess,
        correct: guess.toLowerCase() === questions[currentIdx].answer.toLowerCase()
      })
    );
    setShowAnswer(true);
  }

  function nextQuestion() {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setShowAnswer(false);
    } else {
      const correct = userAnswers.filter(g => g.correct).length;
      onGameEnd({
        correct,
        total: questions.length,
        mode: "Spin the Wheel",
        roundMovies,
        answers: userAnswers,
      });
    }
  }

  const q = questions[currentIdx];
  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>🌀 Spin the Wheel <span style={{ fontSize: "1rem", fontWeight: 400 }}>(Q{currentIdx + 1}/{questions.length})</span></h2>
      <div>
        <div>
          <b>Spin Result</b>: <span style={{ color: '#fb00ff', marginLeft: 6 }}>Year: {q.year} | {q.keyword}: {q.clue}</span>
        </div>
        <br />
        {!showAnswer ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit(e.target.elements.guess.value);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}
          >
            <input name="guess" type="text" placeholder="Guess the movie" required
              style={{
                fontSize: '1.08rem', padding: '7px 13px', borderRadius: '6px',
                background: '#20052a', color: '#fff', border: '1px solid var(--border-color)',
                width: '210px'
              }}
            />
            <button className="btn" type="submit">Submit</button>
            <button className="btn" type="button" style={{ background: "#222", color: "#fb00ff" }} onClick={() => setShowAnswer(true)}>
              Reveal Answer
            </button>
          </form>
        ) : (
          <div>
            <div>
              <strong>Answer:</strong> <span style={{ color: "#fb00ff" }}>{q.answer}</span><br />
              {(userAnswers[currentIdx] && userAnswers[currentIdx].guess) &&
                <span>
                  Your guess: <b>{userAnswers[currentIdx].guess}</b>
                  {userAnswers[currentIdx].correct
                    ? <span style={{ color: 'limegreen', marginLeft: 6 }}>✓ Correct!</span>
                    : <span style={{ color: '#fa0', marginLeft: 6 }}>✗ Incorrect</span>
                  }
                </span>
              }
            </div>
            <button className="btn" style={{ marginTop: 12 }} onClick={nextQuestion}>
              {currentIdx + 1 === questions.length ? "Finish Round" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpinTheWheel;
