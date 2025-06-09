import React, { useEffect, useState } from "react";
import './CharacterMovieMatch.css';

/**
 * Character-Movie Match mode
 * Uses unique movies from shared session, simulates a "character" clue from the movie's title or overview
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
  const [roundMovies, setRoundMovies] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

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

  if (roundMovies.length === 0) {
    return (
      <div className="game-panel glass-panel">
        <button className="btn btn-back" onClick={onBack}>← Back</button>
        <h2>👤 Character-Movie Match</h2>
        <em>Preparing your character clues...</em>
      </div>
    );
  }

  const movie = roundMovies[currentIdx];

  // Simulated: Pick a "character" string fragment from movie title for clue
  const fakeCharacter = (movie.title && movie.title.length > 2)
    ? movie.title.split(' ')[0]
    : "Character";

  function submitGuess(answer) {
    setUserAnswers(prev =>
      prev.concat({ guess: answer, correct: answer.toLowerCase() === movie.title.toLowerCase() })
    );
    setShowAnswer(true);
  }

  function nextQuestion() {
    if (currentIdx + 1 < roundMovies.length) {
      setCurrentIdx(currentIdx + 1);
      setShowAnswer(false);
    } else {
      const correct = userAnswers.filter(g => g.correct).length;
      onGameEnd({
        correct,
        total: roundMovies.length,
        mode: "Character-Movie Match",
        roundMovies, answers: userAnswers,
      });
    }
  }

  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>👤 Character-Movie Match <span style={{ fontSize:"1rem",fontWeight:400}}>(Q{currentIdx+1}/{roundMovies.length})</span></h2>
      <div>
        <div>
          <strong>Which movie has the character <span style={{color:"#fb00ff"}}>"{fakeCharacter}"</span>?</strong>
        </div>
        <br />
        {showAnswer ? (
          <div>
            <b>Correct movie:</b> <span style={{color:'#fb00ff'}}>{movie.title}</span>
            <br/>
            {(userAnswers[currentIdx] && userAnswers[currentIdx].guess) &&
              <span>
                Your answer: <b>{userAnswers[currentIdx].guess}</b>
                {userAnswers[currentIdx].correct
                  ? <span style={{color:'limegreen',marginLeft:6}}>✓ Correct!</span>
                  : <span style={{color:'#fa0',marginLeft:6}}>✗ Incorrect</span>
                }
              </span>
            }
            <div>
              <button className="btn" style={{marginTop:12}} onClick={nextQuestion}>
                {currentIdx+1 === roundMovies.length ? "Finish Round" : "Next"}
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={e=>{e.preventDefault();submitGuess(e.target.elements.movie.value);}}
            style={{marginTop:10,display:'flex',gap:10,flexDirection:'column',alignItems:'center'}}
          >
            <input
              type="text"
              name="movie"
              placeholder="Guess the movie"
              required
              style={{
                fontSize:'1.09rem',padding:'7px 10px',borderRadius:'6px',
                background:'#20052a',color:'#fff',border:'1px solid var(--border-color)',width: '210px'
              }}
            />
            <button className="btn" type="submit">Submit</button>
            <button className="btn" type="button" style={{background:"#111",color:"#fb00ff"}} onClick={()=>setShowAnswer(true)}>
              Reveal Answer
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default CharacterMovieMatch;
