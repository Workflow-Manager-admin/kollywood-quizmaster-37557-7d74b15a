import React, { useEffect, useState } from "react";
import {
  fetchObscureTamilMovies,
  fetchMovieDetails,
  fetchMovieCast
} from "./TMDBUtils";

// PUBLIC_INTERFACE
export default function CharacterMovieMatch({ onBack, onFinish }) {
  const [pairs, setPairs] = useState([]);
  const [charPool, setCharPool] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [status, setStatus] = useState("loading");
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    async function prep() {
      setStatus("loading");
      let movies = await fetchObscureTamilMovies({ perPage: 5 });
      let pairsArr = [];
      let chars = [];
      for (let movie of movies) {
        let credits = await fetchMovieCast(movie.id);
        let character = credits
          .filter(c => c.character && c.character.length > 1)
          .sort(() => Math.random() - 0.5)[0];
        if (character) {
          pairsArr.push({ 
            movie: movie.title, 
            movieId: movie.id, 
            character: character.character,
            actorName: character.name
          });
          chars.push(character.character);
        }
      }
      // Shuffle charPool for drag-match (stub)
      chars = chars.sort(() => Math.random() - 0.5);
      setPairs(pairsArr);
      setCharPool(chars);
      setStatus("ready");
    }
    prep();
  }, []);

  function handleAssign(movieIdx, selectedChar) {
    setAssignments({ ...assignments, [movieIdx]: selectedChar });
  }

  function handleReveal() { setReveal(true); }

  function handleNext() {
    setAssignments({});
    setReveal(false);
    setStatus("loading");
    // Optionally, reload more pairs for replay; for now just finish.
    onFinish();
  }

  if (status === "loading") {
    return (
      <GameLoadingStub title="Character-Movie Match" color="#02d6d1" onBack={onBack} />
    );
  }

  return (
    <section className="container" style={{
      margin:"46px auto 22px", maxWidth:550,
      background:"rgba(18,6,30,.93)", borderRadius:18, border:"2.5px solid #02d6d1", boxShadow:"0 8px 22px #02d6d1aa", padding: "36px 22px"
    }}>
      <h2 style={{color:"#02d6d1",fontWeight:800,marginBottom:6}}>Character-Movie Match</h2>
      <div style={{fontSize:"1.12rem",marginBottom:11,color:"rgba(255,255,255,0.9)"}}>
        Match the Kollywood character to the right film!
      </div>
      <ol>
        {pairs.map((p, idx)=>(
          <li key={idx} style={{marginBottom:8}}>
            <div style={{fontWeight:700,marginBottom:2}}>{p.movie}</div>
            {!reveal ? (
              <select value={assignments[idx] || ""} onChange={e=>handleAssign(idx,e.target.value)} style={{padding:"7px 8px", borderRadius:6}}>
                <option value="">-- Choose character --</option>
                {charPool.map((char, i) => (
                 <option value={char} key={i}>{char}</option>
                ))}
              </select>
            ) : (
              <span>
                <b>→</b> <span style={{color:"#02d6d1"}}>{p.character}</span>
                <span style={{color:"#f8c102",marginLeft:12}}>(Played by {p.actorName})</span>
              </span>
            )}
          </li>
        ))}
      </ol>
      <div style={{display:"flex",gap:18,marginTop:12}}>
        <button className="btn" style={{background:"#02d6d1"}} onClick={onBack}>Back</button>
        {!reveal 
          ? <button className="btn" style={{background:"#fb00ff"}} onClick={handleReveal}>Reveal Answers</button>
          : <button className="btn" style={{background:"#f8c102"}} onClick={handleNext}>Finish</button>
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
      <div style={{fontSize:"1.08rem",color:"rgba(255,255,255,0.75)"}}>Loading...</div>
      <button className="btn" style={{marginTop:30,background:color}} onClick={onBack}>Back</button>
    </section>
  );
}
