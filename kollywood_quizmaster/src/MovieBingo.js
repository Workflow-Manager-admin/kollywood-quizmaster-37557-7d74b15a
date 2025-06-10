import React, { useEffect, useState } from "react";
import { fetchObscureTamilMovies, fetchGenres } from "./TMDBUtils";

// Helper to pick a random Kollywood genre category
const BINGO_CATEGORIES = [
  { name: "Comedy", genreId: 35 },
  { name: "Thriller", genreId: 53 },
  { name: "Family", genreId: 10751 },
  { name: "Romance", genreId: 10749 },
  { name: "Drama", genreId: 18 },
  { name: "Crime", genreId: 80 },
  { name: "Music", genreId: 10402 }
];

// PUBLIC_INTERFACE
export default function MovieBingo({ onBack, onFinish }) {
  const [bingoMovies, setBingoMovies] = useState([]);
  const [marked, setMarked] = useState({});
  const [category, setCategory] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    async function setup() {
      // Randomly pick bingo category
      const cat = BINGO_CATEGORIES[Math.floor(Math.random() * BINGO_CATEGORIES.length)];
      setCategory(cat);
      // Get 25 'hard' tamil movies matching fun genre
      let movies = await fetchObscureTamilMovies({perPage: 25, withGenres: cat.genreId});
      setBingoMovies(movies.map(m => ({
        id: m.id,
        title: m.title
      })));
    }
    setup();
  }, []);

  function handleCellClick(idx) {
    setMarked(m=>({ ...m, [idx]: !m[idx] }));
  }

  function handleReveal() { setRevealed(true); }
  function handleFinish() { onFinish(); }

  if (!category || bingoMovies.length < 25) {
    return (
      <GameLoadingStub title="Movie Bingo" color="#f76409" onBack={onBack} />
    );
  }
  return (
    <section className="container" style={{
      margin:"46px auto 22px", maxWidth:600,
      background:"rgba(18,6,30,.93)", borderRadius:18, border:"2.5px solid #f76409", boxShadow:"0 8px 22px #f7640988", padding: "26px 15px"
    }}>
      <h2 style={{color:"#f76409",fontWeight:800}}>Movie Bingo</h2>
      <div style={{fontSize:"1.10rem",marginBottom:11,color:"rgba(255,255,255,0.9)"}}>
        Find: <span style={{color:"#f8c102",fontWeight:600}}>{category.name} movies</span>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5,1fr)",
        gridGap: 8
      }}>
        {[...Array(25)].map((_, i) => {
          let movie = bingoMovies[i];
          let isMarked = marked[i];
          return (
            <div
              key={i}
              onClick={() => !revealed && handleCellClick(i)}
              style={{
                minHeight:56,
                borderRadius:8,
                background: isMarked ? "#f8c102" : "#22203b",
                color: isMarked ? "#181028" : "#fff",
                fontWeight: 600,
                textAlign: "center",
                padding: "10px",
                cursor: revealed ? "default" : "pointer",
                boxShadow: isMarked ? "0 0 0 3px #f8c10266" : "none",
                border: isMarked ? "2px solid #ffb400" : "2px solid #2a1333"
              }}
            >
              {movie ? movie.title : "—"}
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:18,marginTop:22,alignItems:"center"}}>
        <button className="btn" style={{background:"#f76409"}} onClick={onBack}>Back</button>
        {!revealed
          ? <button className="btn" style={{background:"#fb00ff"}} onClick={handleReveal}>Reveal All</button>
          : <button className="btn" style={{background:"#ffb400"}} onClick={handleFinish}>Finish</button>
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
      <div style={{fontSize:"1.08rem",color:"rgba(255,255,255,0.75)"}}>Setting up movies...</div>
      <button className="btn" style={{marginTop:30,background:color}} onClick={onBack}>Back</button>
    </section>
  );
}
