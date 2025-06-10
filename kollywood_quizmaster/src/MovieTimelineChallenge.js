import React, { useEffect, useState } from "react";
import { fetchObscureTamilMovies } from "./TMDBUtils";

// PUBLIC_INTERFACE
export default function MovieTimelineChallenge({ onBack, onFinish }) {
  const [timeline, setTimeline] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    async function getMovies() {
      let movies = await fetchObscureTamilMovies({ perPage: 7 });
      let moviesWithDate = movies.map(m => ({
        ...m,
        year: m.release_date ? +m.release_date.split("-")[0] : "???"
      }));
      moviesWithDate.sort(() => Math.random() - 0.5); // Shuffle for initial display
      setTimeline(moviesWithDate);
      setUserOrder(moviesWithDate);
    }
    getMovies();
  }, []);

  function move(idx, delta) {
    // Move item in array
    let arr = [...userOrder];
    const newIdx = idx + delta;
    if (newIdx < 0 || newIdx >= arr.length) return;
    const [item] = arr.splice(idx, 1);
    arr.splice(newIdx, 0, item);
    setUserOrder(arr);
  }
  function handleReveal() { setRevealed(true); }
  function handleFinish() { onFinish(); }

  if (!timeline.length) {
    return (
      <GameLoadingStub title="Movie Timeline Challenge" color="#ffb400" onBack={onBack} />
    );
  }
  const sorted = [...timeline].sort((a,b)=>a.year-b.year);

  return (
    <section className="container" style={{
      margin:"46px auto 22px", maxWidth:500,
      background:"rgba(18,6,30,.93)", borderRadius:18, border:"2.5px solid #ffb400", boxShadow:"0 8px 22px #ffb40088", padding: "26px 20px"
    }}>
      <h2 style={{color:"#ffb400",fontWeight:800}}>Movie Timeline Challenge</h2>
      <div style={{fontSize:"1.10rem",marginBottom:13,color:"rgba(255,255,255,0.9)"}}>
        Arrange the movies by release year (earliest to latest).
      </div>
      {!revealed ? (
        <ol style={{paddingInlineStart:20}}>
          {userOrder.map((m,i)=>
            <li key={m.id} style={{marginBottom:8,display:"flex",alignItems:"center",gap:13}}>
              <span style={{fontWeight:700}}>{m.title}</span>
              <button type="button" className="btn" style={{background:"#fb00ff",padding:"2px 13px",fontSize:"0.97rem"}} onClick={()=>move(i,-1)} disabled={i===0}>↑</button>
              <button type="button" className="btn" style={{background:"#6431b3",padding:"2px 13px",fontSize:"0.97rem"}} onClick={()=>move(i,1)} disabled={i===userOrder.length-1}>↓</button>
            </li>
          )}
        </ol>
      ) : (
        <div>
          <h4 style={{color:"#f8c102"}}>Correct Order:</h4>
          <ol style={{paddingInlineStart:24}}>
            {sorted.map(m=>
              <li key={m.id}><b>{m.title}</b> <span style={{color:"#ffb400"}}>({m.year})</span></li>
            )}
          </ol>
        </div>
      )}
      <div style={{display:"flex",gap:18,marginTop:16,alignItems:"center"}}>
        <button className="btn" style={{background:"#ffb400"}} onClick={onBack}>Back</button>
        {!revealed
          ? <button className="btn" style={{background:"#fb00ff"}} onClick={handleReveal}>Reveal</button>
          : <button className="btn" style={{background:"#02d6d1"}} onClick={handleFinish}>Finish</button>
        }
      </div>
    </section>
  );
}

function GameLoadingStub({title, color, onBack}) {
  return (
    <section className="container" style={{
      background:"rgba(18,6,30,.98)",
      borderRadius:18,
      border: `2.5px solid ${color}`,
      boxShadow: `0 8px 32px 0 ${color}33`,
      margin:"46px auto 22px",
      padding:"60px 23px 54px",
      maxWidth:390
    }}>
      <h2 style={{color, fontSize:"2.2rem", margin:"2px 0 13px",fontWeight:700}}>{title}</h2>
      <div style={{fontSize:"1.08rem",color:"rgba(255,255,255,0.75)"}}>Collecting movies...</div>
      <button className="btn" style={{marginTop:30,background:color}} onClick={onBack}>Back</button>
    </section>
  );
}
