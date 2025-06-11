import React, { useEffect, useState } from "react";
import { getPopularMovies, getMovieCredits, getMovieDetails } from "../../utils/tmdbApi";
import ResultsModal from "../../components/ResultsModal";

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

// PUBLIC_INTERFACE
function CastCombo({ onQuit }) {
  const [questions, setQuestions] = useState([]);
  const [ans, setAns] = useState([]);
  const [curr, setCurr] = useState(0);
  const [guess, setGuess] = useState("");
  const [reverse, setReverse] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    (async () => {
      let qs = [];
      const moviesRaw = await getPopularMovies(1, "ta-IN");
      const allMovies = shuffle(moviesRaw.results).slice(0, 8);
      // "forward" questions
      for (let i = 0; i < 3; i++) {
        const mov = allMovies[i];
        const credits = await getMovieCredits(mov.id);
        if (!credits || !credits.cast) continue;
        const actors = shuffle(credits.cast).slice(0, 3).map(a => a.name).filter(Boolean);
        if (actors.length >= 2) {
          qs.push({
            mode: "combo",
            combo: actors,
            answer: mov.title
          });
        }
      }
      // Add a reverse (bonus) mode
      for (let i = 3; i < 5; i++) {
        const mov = allMovies[i];
        const credits = await getMovieCredits(mov.id);
        if (!credits || !credits.cast) continue;
        // Pick one non-cast name
        let allActorNames = credits.cast.map(a => a.name).filter(Boolean);
        let fake = "Unknown";
        for (let n = 0; n < 10; n++) {
          // Try to fetch another movie w/ different cast
          let mov2 = allMovies[5 + (n % 2)];
          if (!mov2 || !mov2.id) continue;
          const credits2 = await getMovieCredits(mov2.id);
          let outsider = (credits2.cast || []).find(a => !allActorNames.includes(a.name));
          if (outsider && outsider.name) {
            fake = outsider.name;
            break;
          }
        }
        // Pick two true, one fake
        let combo = shuffle([
          allActorNames[0] || "Unknown",
          allActorNames[1] || "Unknown",
          fake
        ]);
        qs.push({
          mode: "reverse",
          combo: combo,
          answer: fake,
          movie: mov.title
        });
      }
      setQuestions(shuffle(qs));
    })();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    const q = questions[curr];
    let userOK = false;
    if (q.mode === "combo") {
      userOK = q.answer.toLowerCase() === guess.trim().toLowerCase();
    } else {
      userOK = q.answer.toLowerCase() === guess.trim().toLowerCase();
    }
    setAns(prev => [
      ...prev, {
        question: q.mode === "combo"
          ? `Which movie has actors: ${q.combo.join(", ")}?`
          : `Which actor is NOT in "${q.movie}"?`,
        userAnswer: guess,
        correctAnswer: q.mode === "combo" ? q.answer : q.answer,
        correct: userOK
      }
    ]);
    setGuess("");
    if (curr + 1 >= questions.length) {
      setShowResults(true);
    } else {
      setCurr(curr + 1);
    }
  };

  if (!questions.length) return <div className="kollywood-spinner"></div>;
  if (showResults) return (
    <ResultsModal
      results={{
        score: ans.filter(a => a.correct).length,
        total: questions.length,
        answers: ans
      }}
      onClose={onQuit}
    />
  );

  const q = questions[curr];
  return (
    <div style={{ margin: "36px auto", maxWidth: 420 }}>
      <div className="kollywood-game-header">Cast Combo{q.mode === "reverse" ? " (Bonus: Reverse!)" : ""}</div>
      <div style={{ fontSize: 18, textAlign: "center", marginBottom: 21 }}>
        {q.mode === "combo"
          ? <div>
            <b>Actors:</b> {q.combo.join(", ")}
            <br /><br />
            <span style={{ color: "#a246ff", fontSize: 16 }}>Which Kollywood movie stars them?</span>
          </div>
          : <div>
            <b>Movie:</b> {q.movie}
            <br /><b>Actors:</b> {q.combo.join(", ")}
            <br /><br />
            <span style={{ color: "#a246ff", fontSize: 16 }}>Which ONE actor is NOT in this movie?</span>
          </div>
        }
      </div>
      <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
        <input
          value={guess}
          placeholder={q.mode === "combo" ? "Movie Title" : "Actor Name"}
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
        Question {curr + 1} of {questions.length}
      </div>
    </div>
  );
}

export default CastCombo;
