import React, { useEffect, useState } from "react";
import { getPopularMovies, getMovieDetails } from "../../utils/tmdbApi";
import ResultsModal from "../../components/ResultsModal";

const BINGO_CATEGORIES = [
  "Before 2010",
  "After 2018",
  "Has a romance theme",
  "Has a known comedian",
  "Action genre",
  "Director is a famous Kollywood name",
  "Lead is Vijay, Ajith or Rajini",
  "Won any award",
  "Runtime >150 min",
  "Title with a single word"
];

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

function satisfies(cat, movie, details) {
  switch (cat) {
    case "Before 2010":
      return (details.release_date ? parseInt(details.release_date) < 2010 : false);
    case "After 2018":
      return (details.release_date ? parseInt(details.release_date) > 2018 : false);
    case "Has a romance theme":
      return (details.genres || []).some(g=>/romance/i.test(g.name));
    case "Action genre":
      return (details.genres || []).some(g=>/action/i.test(g.name));
    case "Won any award":
      return false;
    case "Director is a famous Kollywood name":
      return false;
    case "Has a known comedian":
      return false;
    case "Lead is Vijay, Ajith or Rajini":
      if (!details.credits) return false;
      return (details.credits.cast || []).slice(0,3).some(a => (a.name||"").match(/vijay|ajith|rajini/i));
    case "Runtime >150 min":
      return (details.runtime || 0) > 150;
    case "Title with a single word":
      return (details.title || "").split(/\s+/).length <= 1;
    default:
      return false;
  }
}

// PUBLIC_INTERFACE
function MovieBingo({ onQuit }) {
  const [movies, setMovies] = useState([]);
  const [selected, setSelected] = useState({});
  const [results, setResults] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getPopularMovies(1, "ta-IN");
      setMovies(shuffle(data.results).slice(0, 25));
    })();
  }, []);

  useEffect(() => {
    if (movies.length) {
      // Preload details for categories (could optimize)
      Promise.all(movies.map(m => getMovieDetails(m.id))).then(detailsArr => {
        // Attach details to corresponding cell
        setMovies(movies.map((m, i) => ({
          ...m,
          details: detailsArr[i]
        })));
      });
    }
  }, [movies.length]);

  const handleSelect = idx => {
    setSelected(s => ({ ...s, [idx]: !s[idx] }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Check how many user "bingoed" correctly, 1 point for each correct category-cell association
    let answers = Object.keys(selected).map(idx => {
      const m = movies[parseInt(idx)];
      const categories = BINGO_CATEGORIES.filter(cat => satisfies(cat, m, m.details));
      return {
        question: `Did "${m.title}" match a bingo category?`,
        correct: categories.length > 0,
        userAnswer: selected[idx] ? "selected" : "not selected",
        correctAnswer: categories.join("; ") || "(none)"
      };
    });
    setResults({ score: answers.filter(a => a.correct && a.userAnswer === "selected").length, total: movies.length, answers });
  };

  if (!movies.length) return <div className="kollywood-spinner"></div>;
  if (results) return <ResultsModal results={results} onClose={onQuit} />;

  return (
    <div style={{ margin: "34px auto", maxWidth: 680 }}>
      <div className="kollywood-game-header">Movie Bingo</div>
      <form onSubmit={handleSubmit}>
        <div className="kollywood-bingo-grid" style={{ margin: "22px 0" }}>
          {movies.map((m, idx) =>
            <div
              className={`kollywood-bingo-cell${selected[idx] ? " selected" : ""}`}
              key={m.id}
              onClick={() => handleSelect(idx)}
            >
              {m.title}
            </div>
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          <button className="kollywood-btn">Submit & Score</button>
        </div>
        <div style={{ fontSize: 14, marginTop: 15, color: "#a246ff", textAlign: "center" }}>
          Click all movies you think fit any fun Kollywood bingo categories!
        </div>
      </form>
    </div>
  );
}

export default MovieBingo;
