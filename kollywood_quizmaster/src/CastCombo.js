import React, { useEffect, useState } from "react";
import { fetchObscureTamilMovies, fetchMovieDetails } from "./TMDBUtils";

// PUBLIC_INTERFACE
export default function CastCombo({ onBack, onReverseMode, onFinish }) {
  const [combo, setCombo] = useState(null);
  const [guess, setGuess] = useState("");
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    async function genCombo() {
      // Get 1 obscure tamil film and pick 2-3 actors
      let movies = await fetchObscureTamilMovies({ perPage: 1 });
      let detail = await fetchMovieDetails(movies[0].id);
      let cast = (detail.credits && detail.credits.cast) ? detail.credits.cast : [];
      // Shuffle and select 3 with reasonable name length
      let pool = cast
        .filter(c => c.name && c.name.length > 2)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      setCombo({
        movie: detail.title,
        actors: pool.map(c => c.name),
        answer: detail.title
      });
      setAnswered(false);
    }
    genCombo();
  }, []);

  function handleGuess(e) {
    e.preventDefault();
    setAnswered(true);
  }

  if (!combo) 
    return <GameLoadingStub title="Cast Combo" color="#8236fa" onBack={onBack} />;

  return (
    <section className="container" style={{
      margin:"46px auto 22px", maxWidth:470,
      background:"rgba(18,6,30,.93)", borderRadius:18, border:"2.5px solid #8236fa", boxShadow:"0 8px 22px #8236fa88", padding: "36px 18px"
    }}>
      <h2 style={{color:"#8236fa",fontWeight:800,marginBottom:11}}>Cast Combo</h2>
      <div style={{fontSize:"1.10rem",marginBottom:10,color:"rgba(255,255,255,0.9)"}}>
        Guess the Kollywood movie featuring all these actors!
      </div>
      <div style={{
        background:"#4e387d", color:"#fff",borderRadius:9,padding:"12px", fontWeight:700,letterSpacing:".6px",marginBottom:18
      }}>
        {combo.actors.map(a=><span key={a} style={{display:"inline-block",padding:"2px 12px", marginRight:6, borderRadius:7, background:"#241443"}}>{a}</span>)}
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
              border:"2px solid #8236fa",
              borderRadius:8
            }}
            autoFocus
            required
          />
          <button type="submit" className="btn" style={{background:"#8236fa",marginTop:6}}>Submit</button>
        </form>
      ) : (
        <div style={{margin:"14px 0",fontSize:"1.12rem",fontWeight:700}}>
          Correct Answer: <span style={{color:"#8236fa"}}>{combo.answer}</span>
        </div>
      )}
      <div style={{display:"flex",gap:14,marginTop:10}}>
        <button className="btn" style={{background:"#02d6d1"}} onClick={onBack}>Back</button>
        <button className="btn" style={{background:"#fb00ff"}} type="button" onClick={onReverseMode}>Reverse Mode</button>
        {answered
          ? <button className="btn" style={{background:"#f8c102"}} onClick={onFinish}>Finish</button>
          : <button className="btn" style={{background:"#ffb400"}} type="button" onClick={()=>setAnswered(true)}>Reveal</button>
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
      <div style={{fontSize:"1.08rem",color:"rgba(255,255,255,0.75)"}}>Getting actors...</div>
      <button className="btn" style={{marginTop:30,background:color}} onClick={onBack}>Back</button>
    </section>
  );
}
