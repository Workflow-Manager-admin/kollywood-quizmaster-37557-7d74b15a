import React, { useState, useEffect } from "react";
import { getPopularMovies, getMovieDetails } from "../../utils/tmdbApi";
import ResultsModal from "../../components/ResultsModal";

function shuffle(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

function compareOrder(arr, correctOrder) {
  return arr.every((item, i) => item.id === correctOrder[i].id);
}

// PUBLIC_INTERFACE
function MovieTimelineChallenge({ onQuit }) {
  const [movies, setMovies] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [answerDetails, setAnswerDetails] = useState(null);

  useEffect(() => {
    (async () => {
      const mobjs = await getPopularMovies(1, "ta-IN");
      const chosen = shuffle(mobjs.results).slice(0, 7);
      const details = await Promise.all(chosen.map(m => getMovieDetails(m.id)));
      const withDates = details.map((d, i) => ({
        id: chosen[i].id,
        title: chosen[i].title,
        release: d.release_date ? new Date(d.release_date) : new Date("1970-01-01")
      }));
      setMovies(withDates);
      setTimeline(shuffle(withDates));
    })();
  }, []);

  const onDragStart = idx => setDraggedIdx(idx);

  const onDrop = idx => {
    if (draggedIdx === null) return;
    const copy = [...timeline];
    const [removed] = copy.splice(draggedIdx, 1);
    copy.splice(idx, 0, removed);
    setTimeline(copy);
    setDraggedIdx(null);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const correct = [...movies].sort((a, b) => a.release - b.release);
    setShowResults(true);
    setAnswerDetails({
      score: timeline.filter((m, i) => m.id === correct[i].id).length,
      total: timeline.length,
      answers: timeline.map((m, i) => ({
        question: `Movie in slot ${i + 1}`,
        userAnswer: m.title,
        correctAnswer: correct[i].title,
        correct: m.id === correct[i].id
      }))
    });
  };

  if (!timeline.length) return <div className="kollywood-spinner"></div>;
  if (showResults && answerDetails)
    return <ResultsModal results={answerDetails} onClose={onQuit} />;

  return (
    <div style={{ margin: "36px auto", maxWidth: 540 }}>
      <div className="kollywood-game-header">Timeline Challenge</div>
      <form onSubmit={handleSubmit}>
        <div style={{ margin: "28px 0" }}>
          {timeline.map((m, idx) => (
            <div
              className={`kollywood-timeline-slot${draggedIdx === idx ? " dragged" : ""}`}
              key={m.id}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={e => { e.preventDefault(); }}
              onDrop={() => onDrop(idx)}
            >
              {m.title}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <button className="kollywood-btn" type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default MovieTimelineChallenge;
