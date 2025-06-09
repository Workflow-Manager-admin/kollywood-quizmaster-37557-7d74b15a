import React, { useEffect, useState } from "react";
import './MovieTimeline.css';

/**
 * Movie Timeline Challenge: Drag/drop or click-to-order N unique movies by release year.
 */
function MovieTimeline({
  claimMoviesForRound,
  sessionInitialized,
  initializeSession,
  remainingCount,
  onGameEnd,
  onBack,
}) {
  const NUM_MOVIES = 7;
  const [roundMovies, setRoundMovies] = useState([]);
  const [orderedIds, setOrderedIds] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!sessionInitialized) initializeSession();
    if (sessionInitialized && roundMovies.length === 0) {
      const claimed = claimMoviesForRound(NUM_MOVIES);
      if (claimed && claimed.length === NUM_MOVIES) {
        setRoundMovies(claimed);
        setOrderedIds(shuffleIds(claimed.map(m=>m.id)));
      }
    }
    // eslint-disable-next-line
  }, [sessionInitialized, claimMoviesForRound]);

  function shuffleIds(array) {
    // Simple Fisher-Yates shuffle
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  if (roundMovies.length === 0) {
    return (
      <div className="game-panel glass-panel">
        <button className="btn btn-back" onClick={onBack}>← Back</button>
        <h2>⏳ Movie Timeline Challenge</h2>
        <em>Building your timeline challenge...</em>
      </div>
    );
  }

  // Lookup map: id -> movie object
  const movieMap = Object.fromEntries(roundMovies.map(m=>[m.id,m]));
  // What is the correct order (ascending by release year)?
  const timelineOrder = roundMovies
    .slice()
    .sort((a,b) => (a.release_date || "9999").localeCompare(b.release_date || "9999"))
    .map(m => m.id);

  function move(idx, dir) {
    // Move element at idx left (-1) or right (+1)
    if ((idx === 0 && dir === -1) || (idx === orderedIds.length - 1 && dir === 1)) return;
    const arr = orderedIds.slice();
    [arr[idx], arr[idx + dir]] = [arr[idx + dir], arr[idx]];
    setOrderedIds(arr);
  }

  function handleSubmit() {
    setSubmitted(true);
    setTimeout(() => {
      let correct = 0;
      for (let i = 0; i < timelineOrder.length; ++i) {
        if (timelineOrder[i] === orderedIds[i]) correct++;
      }
      onGameEnd({
        correct,
        total: timelineOrder.length,
        mode: "Movie Timeline Challenge",
        roundMovies,
        answers: orderedIds,
      });
    }, 1700);
  }

  return (
    <div className="game-panel glass-panel">
      <button className="btn btn-back" onClick={onBack}>← Back</button>
      <h2>⏳ Movie Timeline Challenge <span style={{ fontSize:"1rem",fontWeight:400}}>({roundMovies.length} movies)</span></h2>
      <div>
        <p>Reorder movies chronologically (earliest release first)</p>
        <div
          style={{
            display:'flex',flexDirection:'row',flexWrap:'wrap',gap:'8px',justifyContent:'center',marginBottom:14
          }}
        >
          {orderedIds.map((mid, idx) => (
            <div
              key={mid}
              className="btn"
              style={{
                width:'170px',
                minHeight:'50px',
                background: submitted
                  ? (timelineOrder[idx] === mid ?'#29c777' :'#fb00ff33')
                  : 'var(--card-bg)',
                color: submitted
                  ? '#fff'
                  : '#fb00ff',
                borderRadius:'8px',
                border:'2px solid var(--border-color)',
                display:'flex',alignItems:'center',justifyContent:'space-between',
                fontWeight:600,
                transition:'background .18s'
              }}
            >
              <span>{movieMap[mid]?.title || "??"}</span>
              <span style={{marginLeft:9}}><b>{submitted ? (movieMap[mid]?.release_date?.substring(0,4) ?? "?") : null}</b></span>
              {!submitted && (
                <span>
                  <button className="btn" style={{fontSize:18,padding:"1px 8px 2px 7px",marginLeft:9}}
                    disabled={idx===0} onClick={()=>move(idx,-1)}>&lt;</button>
                  <button className="btn" style={{fontSize:18,padding:"1px 7px 2px 8px"}} disabled={idx===orderedIds.length-1} onClick={()=>move(idx,1)}>&gt;</button>
                </span>
              )}
            </div>
          ))}
        </div>
        {!submitted
          ? <button className="btn" onClick={handleSubmit}>Submit Timeline</button>
          : <b>Checking...</b>
        }
      </div>
    </div>
  );
}

export default MovieTimeline;
