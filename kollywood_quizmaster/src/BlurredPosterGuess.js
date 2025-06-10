import React, { useEffect, useState } from "react";
import {
  fetchObscureTamilMovies,
  fetchMovieDetails,
} from "./TMDBUtils";

// PUBLIC_INTERFACE
export default function BlurredPosterGuess({ onBack, onFinish }) {
  // State for quiz engine
  const [questions, setQuestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currGuess, setCurrGuess] = useState("");
  const [status, setStatus] = useState("loading");
  const [answerVis, setAnswerVis] = useState(false);
  const [score, setScore] = useState(0);

  // Load quiz data on mount
  useEffect(() => {
    async function prep() {
      setStatus("loading");
      let qns = [];
      let movies = await fetchObscureTamilMovies({ perPage: 10 });
      for(let movie of movies) {
        let details = await fetchMovieDetails(movie.id);
        let poster = details.poster_path 
          ? `https://image.tmdb.org/t/p/w500${details.poster_path}` 
          : null;
        // Construct clues
        let clues = [
          details.release_date ? `Year: ${details.release_date.split("-")[0]}` : null,
          details.genres && details.genres.length ? `Genre: ${details.genres.map(g=>g.name).join(", ")}` : null,
          details.overview ? `Hint: ${details.overview.split(" ").slice(0,10).join(" ")}...` : null
        ].filter(Boolean);
        qns.push({
          movieId: movie.id,
          answer: details.title,
          poster,
          clues,
        });
      }
      setQuestions(qns);
      setStatus("ready");
    }
    prep();
  }, []);

  function handleGuessSubmit(e) {
    e.preventDefault();
    if (!questions[activeIndex]) return;
    // Accept if answer includes Tamil or English form (fuzzy, case-insensitive)
    const correct = questions[activeIndex].answer.toLowerCase();
    const guess = currGuess.trim().toLowerCase();
    if (guess && correct.includes(guess)) {
      setScore(x=>x+1);
      setAnswerVis(true);
    } else {
      setAnswerVis(true);
    }
  }

  function nextQn() {
    setCurrGuess("");
    setAnswerVis(false);
    setActiveIndex(activeIndex+1);
  }

  if (status !== "ready")
    return (
      <GameLoadingStub title="Blurred Poster Guess" color="#fb00ff" onBack={onBack} />
    );
  
  // End-of-game: show stub scoring
  if (activeIndex >= questions.length) {
    return (
      <section className="container" style={{margin:"40px auto", maxWidth:400, padding:36, background:"#181028", borderRadius:18, border:"2.5px solid #fb00ff", boxShadow:"0 6px 26px 0 #fb00ff33"}}>
        <h2 style={{color:"#fb00ff", fontWeight:700, fontSize:"2rem"}}>Quiz Complete!</h2>
        <p style={{fontSize:"1.1rem", margin:"16px 0"}}>{score} / {questions.length} correct.</p>
        <button className="btn" style={{background:"#fb00ff",marginRight:18}} onClick={onBack}>Back</button>
        <button className="btn" style={{background:"#02d6d1"}} onClick={onFinish}>Finish</button>
      </section>
    );
  }

  const qn = questions[activeIndex];
  return (
    <section className="container" style={{margin:"46px auto 22px", maxWidth:430,
      background:"rgba(18,6,30,.93)", borderRadius:18, border:"2.5px solid #fb00ff", boxShadow:"0 8px 22px #fb00ff33", padding: "36px 18px"}}>
      <h2 style={{color:"#fb00ff",fontWeight:800}}>Blurred Poster Guess</h2>
      <div className="subtitle" style={{margin:"13px 0 9px",fontWeight:700}}>
        Question {activeIndex+1} / {questions.length}
      </div>
      {qn.poster ? (
        <div style={{filter:"blur(9px)", margin:"16px 0", width:222, height:330, background:"#111",marginLeft:"auto", marginRight:"auto",borderRadius:9,
          backgroundImage:`url(${qn.poster})`,backgroundSize:"cover",backgroundPosition:"center"}}>
          <img
            src={qn.poster}
            alt="blurred poster"
            style={{width:222, height:330, borderRadius:9, opacity:0}}
          />
        </div>
      ):(
        <div style={{margin:"36px auto",fontSize:"0.96rem",textAlign:"center",color:"#fb00ff"}}>Image Unavailable</div>
      )}

      <ul style={{listStyle:"disc", marginLeft:30, marginBottom:17, color:"#f8c102"}}>
        {qn.clues.map((c,i)=><li key={i} style={{marginBottom:2}}>{c}</li>)}
      </ul>

      {!answerVis ? (
        <form onSubmit={handleGuessSubmit} style={{marginBottom:17,display:"flex",flexDirection:"column",alignItems:"center"}}>
          <input
            value={currGuess}
            onChange={e=>setCurrGuess(e.target.value)}
            placeholder="Enter your answer (movie title)..."
            style={{
              width:"98%",
              margin:"12px 0",
              fontSize:"1rem",
              padding:"9px 12px",
              border:"2px solid #fb00ff",
              borderRadius:8
            }}
            autoFocus
            required
          />
          <button type="submit" className="btn" style={{background:"#fb00ff",marginTop:5}}>Guess</button>
        </form>
      ) : (
        <div style={{margin:"14px 0",fontSize:"1.1rem",fontWeight:700}}>
          Correct Answer: <span style={{color:"#fb00ff"}}>{qn.answer}</span>
        </div>
      )}

      <div style={{display:"flex",gap:18,marginTop:14}}>
        <button className="btn" style={{background:"#02d6d1"}} onClick={onBack}>Back</button>
        {answerVis
          ? <button className="btn" style={{background:"#fb00ff"}} onClick={nextQn}>Next</button>
          : <button className="btn" style={{background:"#f8c102"}} type="button" onClick={()=>setAnswerVis(true)}>Reveal Answer</button>
        }
      </div>
    </section>
  );
}


// -- Shared (loading stub) --
function GameLoadingStub({title, color, onBack}) {
  return (
    <section className="container" style={{
      background:"rgba(18,6,30,.96)",
      borderRadius:18,
      border: `2.5px solid ${color}`,
      boxShadow: `0 8px 32px 0 ${color}33`,
      margin:"46px auto 22px",
      padding:"60px 23px 54px",
      maxWidth:390
    }}>
      <h2 style={{color, fontSize:"2.2rem", margin:"2px 0 13px",fontWeight:700}}>{title}</h2>
      <div style={{fontSize:"1.08rem",color:"rgba(255,255,255,0.75)"}}>Preparing questions (Kollywood mode)...</div>
      <button className="btn" style={{marginTop:30,background:color}} onClick={onBack}>Back</button>
    </section>
  );
}
