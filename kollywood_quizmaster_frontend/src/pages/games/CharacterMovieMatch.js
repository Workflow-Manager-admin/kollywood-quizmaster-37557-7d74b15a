import React, { useEffect, useState } from "react";
import { getPopularMovies, getMovieCredits } from "../../utils/tmdbApi";
import ResultsModal from "../../components/ResultsModal";

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

// Returns list of {character, movieTitle}
async function makeCharacterMovieQuestions() {
  const data = await getPopularMovies(1, "ta-IN");
  const movies = shuffle(data.results.filter(m => m.id)).slice(0, 6);
  const questions = [];
  for (let movie of movies) {
    const credits = await getMovieCredits(movie.id);
    const actor = (credits.cast || [])[0];
    if (actor && actor.character && actor.name) {
      questions.push({
        character: actor.character,
        movieTitle: movie.title
      });
    }
  }
  return shuffle(questions).slice(0, 5);
}

function CharacterMovieMatch({ onQuit }) {
  const [questions, setQuestions] = useState([]);
  const [match, setMatch] = useState({}); // {character: chosenMovie}
  const [options, setOptions] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    (async () => {
      const q = await makeCharacterMovieQuestions();
      setQuestions(q);
      setOptions(shuffle(q.map(qi => qi.movieTitle)));
    })();
  }, []);

  const handleSet = (c, m) => {
    setMatch(prev => ({ ...prev, [c]: m }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const answers = questions.map(q => ({
      question: `Which movie for character "${q.character}"?`,
      correctAnswer: q.movieTitle,
      userAnswer: match[q.character] || "(none)",
      correct: (match[q.character] || "") === q.movieTitle
    }));
    setShowResults({ score: answers.filter(a => a.correct).length, total: questions.length, answers });
  };

  if (!questions.length) return <div className="kollywood-spinner"></div>;

  if (showResults)
    return <ResultsModal results={showResults} onClose={onQuit} />;

  return (
    <div style={{ margin: "36px auto", maxWidth: 600 }}>
      <div className="kollywood-game-header">Character-Movie Match</div>
      <form onSubmit={handleSubmit}>
        {questions.map(q => (
          <div style={{ marginBottom: 18 }} key={q.character}>
            <div style={{ fontWeight: 600, color: "#a246ff" }}>
              Character: {q.character}
            </div>
            <select
              value={match[q.character] || ""}
              onChange={e => handleSet(q.character, e.target.value)}
              style={{ padding: 6, fontSize: 16, borderRadius: 6, marginTop: 4 }}
            >
              <option value="">Select movie</option>
              {options.map(mov => (
                <option key={mov} value={mov}>{mov}</option>
              ))}
            </select>
          </div>
        ))}
        <button className="kollywood-btn" style={{ marginTop: 16 }}>Submit</button>
      </form>
    </div>
  );
}

export default CharacterMovieMatch;
