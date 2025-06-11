import React, { useEffect, useState } from "react";
import { getPopularMovies, getPosterUrl, getMovieDetails } from "../../utils/tmdbApi";
import { useQuiz } from "../../context/QuizContext";
import ResultsModal from "../../components/ResultsModal";

// Returns a shuffled copy of array.
function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

// PUBLIC_INTERFACE
function BlurredPosterGuess({ onQuit }) {
  const [movies, setMovies] = useState([]);
  const [curr, setCurr] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [guess, setGuess] = useState("");
  const [showHint, setShowHint] = useState([false, false]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  // Fetch movies on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getPopularMovies(1, "ta-IN");
      // Only keep movies with poster and overview
      const filtered = shuffle(data.results.filter(m => m.poster_path && m.overview)).slice(0, 10);
      setMovies(filtered);
      setLoading(false);
    })();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correct = movies[curr]?.title.toLowerCase().trim() === guess.toLowerCase().trim();
    setAnswers(ans => [
      ...ans,
      {
        question: "Guess the movie (Blurred Poster)",
        correct,
        userAnswer: guess,
        correctAnswer: movies[curr]?.title
      }
    ]);
    setGuess("");
    setShowHint([false, false]);
    if (curr + 1 >= movies.length) {
      setShowResults(true);
    } else {
      setCurr(curr + 1);
    }
  };

  if (loading) {
    return <div className="kollywood-spinner"></div>;
  }

  if (showResults) {
    return <ResultsModal
      results={{
        score: answers.filter(a => a.correct).length,
        total: movies.length,
        answers
      }}
      onClose={onQuit}
    />;
  }

  const movie = movies[curr];
  // Get first 2 words from overview as clues
  const clues = movie?.overview.split(/[.]/).filter(w => w.trim().length > 8).slice(0, 2);

  return (
    <div style={{ margin: "36px auto", maxWidth: 480 }}>
      <div className="kollywood-game-header">Blurred Poster Guess</div>
      <div style={{ textAlign: "center" }}>
        <img
          src={getPosterUrl(movie.poster_path, "w342")}
          alt="Blurred Poster"
          className="kollywood-blur-img"
          width={230}
          height={320}
        />
        <div style={{ margin: "14px 0 8px 0", color: "#c149fc" }}>
          <button className="kollywood-btn" style={{ margin: 0 }} onClick={() => setShowHint([true, showHint[1]])}>Hint 1</button>
          <button className="kollywood-btn" style={{ margin: '0 0 0 8px' }} onClick={() => setShowHint([showHint[0], true])}>Hint 2</button>
          <button className="kollywood-btn" style={{ marginLeft: 10 }} onClick={() => handleSubmit({ preventDefault:()=>{} })}>Reveal Answer (Skip)</button>
        </div>
        <div style={{ color: "#556", fontSize: 14, minHeight: 56 }}>
          {showHint[0] && clues[0] && <div><b>Clue 1:</b> {clues[0]}</div>}
          {showHint[1] && clues[1] && <div><b>Clue 2:</b> {clues[1]}</div>}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            value={guess}
            placeholder="Your answer"
            onChange={e => setGuess(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: 7,
              border: "1px solid #bfaaff",
              fontSize: 17,
              width: "80%",
              marginBottom: 9
            }}
            autoFocus
          />
          <br />
          <button className="kollywood-btn">Submit</button>
        </form>
        <div style={{ marginTop: 10, fontSize: 13, color: "#cbb" }}>
          Question {curr + 1} of {movies.length}
        </div>
      </div>
    </div>
  );
}

export default BlurredPosterGuess;
