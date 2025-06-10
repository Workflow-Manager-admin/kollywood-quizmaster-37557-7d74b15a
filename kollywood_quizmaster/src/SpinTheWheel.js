import React, { useEffect, useState } from "react";
import { fetchObscureTamilMovies, fetchMovieDetails } from "./TMDBUtils";

// Helper to pick random item
function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

// PUBLIC_INTERFACE
export default function SpinTheWheel({ onBack, onFinish }) {
  const [combo, setCombo] = useState(null);
  const [question, setQuestion] = useState(null);
  const [guess, setGuess] = useState("");
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    async function getComboQn() {
      // Fetch random obscure Kollywood movie, extract lead actor, lead actress, year
      let movies = await fetchObscureTamilMovies({ perPage: 8 });
      let movie = pick(movies);
      let details = await fetchMovieDetails(movie.id);
      let year = details.release_date ? details.release_date.split("-")[0] : "?";
      let actors = (details.credits && details.credits.cast)
        ? details.credits.cast.filter(a => a.gender===2)
        : [];
      let actresses = (details.credits && details.credits.cast)
        ? details.credits.cast.filter(a => a.gender===1)
        : [];
      let leadActor = pick(actors);
      let leadActress = pick(actresses);
      setCombo({
        actor: leadActor && leadActor.name ? leadActor.name : "(Unknown Male Lead)",
        actress: leadActress && leadActress.name ? leadActress.name : "(Unknown Female Lead)",
        year,
        answer: details.title
      });
      setAnswered(false);
      setQuestion(details);
    }
    getComboQn();
  }, []);

  function handleGuess(e) {
    e.preventDefault();
    setAnswered(true);
  }
  function nextCombo() { setAnswered(false); setGuess(""); window.location.reload(); }
  if (!combo)
    return <GameLoadingStub title="Spin the Wheel" color="#fb00ff" onBack={onBack} />;

  return (
    <section className="container" style={{
      margin:"46px auto 22px", maxWidth:440,
      background:"rgba(18,6,30,.93)", borderRadius:18, border:"2.5px solid #fb00ff", boxShadow:"0 8px 22px #fb00ff88", padding: "32px 16px"
    }}>
      <h2 style={{color:"#fb00ff",fontWeight:800,marginBottom:7}}>Spin the Wheel</h2>
      <div style={{fontSize:"1.10rem",marginBottom:15,color:"rgba(255,255,255,0.9)"}}>
        Given actor, actress & year, guess the Kollywood movie.
      </div>
      <div style={{padding:"12px 10px",borderRadius:8,background:"#241443",marginBottom:15}}>
        <span style={{fontWeight:700}}>Actor</span>: <span style={{color:"#f8c102"}}>{combo.actor}</span><br />
        <span style={{fontWeight:700}}>Actress</span>: <span style={{color:"#ffb400"}}>{combo.actress}</span><br />
        <span style={{fontWeight:700}}>Year</span>: <span style={{color:"#fb00ff"}}>{combo.year}</span>
      </div>
      {!answered ? (
        <form onSubmit={handleGuess} style={{marginBottom:13,display:"flex",flexDirection:"column",alignItems:"center"}}>
          <input
            value={guess}
            onChange={e=>setGuess(e.target.value)}
            placeholder="Movie title..."
            style={{
              width:"98%",
              margin:"11px 0 3px",
              fontSize:"1rem",
              padding:"9px 12px",
              border:"2px solid #fb00ff",
              borderRadius:8
            }}
            autoFocus
            required
          />
          <button type="submit" className="btn" style={{background:"#fb00ff",marginTop:6}}>Submit</button>
        </form>
      ) : (
        <div style={{margin:"14px 0",fontSize:"1.12rem",fontWeight:700}}>
          Correct Answer: <span style={{color:"#fb00ff"}}>{combo.answer}</span>
        </div>
      )}
      <div style={{display:"flex",gap:18,marginTop:10}}>
        <button className="btn" style={{background:"#02d6d1"}} onClick={onBack}>Back</button>
        {answered
          ? <button className="btn" style={{background:"#f8c102"}} onClick={onFinish}>Finish</button>
          : <button className="btn" style={{background:"#ffb400"}} type="button" onClick={()=>setAnswered(true)}>Reveal</button>}
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
      <div style={{fontSize:"1.08rem",color:"rgba(255,255,255,0.75)"}}>Spinning for a new combo...</div>
      <button className="btn" style={{marginTop:30,background:color}} onClick={onBack}>Back</button>
    </section>
  );
}
