import React, { useState, useEffect } from "react";
import { getPopularMovies, getMovieDetails, getMovieCredits } from "../../utils/tmdbApi";
import ResultsModal from "../../components/ResultsModal";

// PUBLIC_INTERFACE
function SpinTheWheel({ onQuit }) {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currIndex, setCurrIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [spinData, setSpinData] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Prepare 5 random "spins"
    (async () => {
      const moviesData = await getPopularMovies(1, "ta-IN");
      const movies = moviesData.results.slice(0, 15);
      let spins = [];
      for (let i = 0; i < 5; i++) {
        const m = movies[Math.floor(Math.random() * movies.length)];
        const details = await getMovieDetails(m.id);
        const credits = await getMovieCredits(m.id);
        // Safety
        if (!details || !credits) continue;
        const cast = (credits.cast || []).filter(c => !!c.name);
        // Random pick actor/actress from the cast
        const mainActor = (cast.length ? cast[Math.floor(Math.random() * cast.length)] : { name: "Unknown" }).name;
        const mainActress = (cast.length > 1 ? cast[Math.floor(Math.random() * cast.length)] : { name: "Unknown" }).name;
        spins.push({
          actor: mainActor,
          actress: mainActress,
          year: details.release_date?.slice(0, 4),
          movieTitle: details.title
        });
      }
      setQuestions(spins);
      setSpinData(spins[0]);
    })();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserAnswers(ans => [
      ...ans,
      {
        question: `Actor: ${spinData.actor}, Actress: ${spinData.actress}, Year: ${spinData.year}`,
        correctAnswer: spinData.movieTitle,
        userAnswer: guess,
        correct: spinData.movieTitle.toLowerCase().trim() === guess.toLowerCase().trim()
      }
    ]);
    setGuess("");
    // Show next spin
    if (currIndex + 1 < questions.length) {
      setCurrIndex(currIndex + 1);
      setSpinData(questions[currIndex + 1]);
    } else {
      setShowResults(true);
    }
  };

  if (!questions.length || !spinData) return <div className="kollywood-spinner"></div>;
  if (showResults)
    return (
      <ResultsModal
        results={{
          score: userAnswers.filter(a => a.correct).length,
          total: questions.length,
          answers: userAnswers
        }}
        onClose={onQuit}
      />
    );

  return (
    <div style={{ margin: "36px auto", maxWidth: 420 }}>
      <div className="kollywood-game-header">Spin the Wheel!</div>
      <div style={{ fontSize: 18, textAlign: "center", marginBottom: 14 }}>
        <span style={{ color: "#a246ff", fontWeight: 600, fontSize: 22 }}>Actor:</span> {spinData.actor}<br />
        <span style={{ color: "#f486f0", fontWeight: 600, fontSize: 22 }}>Actress:</span> {spinData.actress}<br />
        <span style={{ color: "#ffd700", fontWeight: 600, fontSize: 22 }}>Year:</span> {spinData.year}
      </div>
      <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
        <input
          value={guess}
          placeholder="Your answer: Movie title"
          onChange={e => setGuess(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: 7,
            border: "1px solid #bfaaff",
            fontSize: 17,
            width: "90%",
            marginBottom: 13
          }}
        />
        <br />
        <button className="kollywood-btn" style={{ width: "80%" }}>Submit</button>
      </form>
      <div style={{ marginTop: 10, fontSize: 13, color: "#cbb", textAlign: "center" }}>
        Spin {currIndex + 1} of {questions.length}
      </div>
    </div>
  );
}

export default SpinTheWheel;
