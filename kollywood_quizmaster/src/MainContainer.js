import React, { useState } from "react";
import BlurredPosterGuess from "./BlurredPosterGuess";
import CharacterMovieMatch from "./CharacterMovieMatch";
import MovieBingo from "./MovieBingo";
import MovieTimelineChallenge from "./MovieTimelineChallenge";
import SpinTheWheel from "./SpinTheWheel";
import CastCombo from "./CastCombo";

/**
 * Kollywood QuizMaster Main Container
 * 
 * Features:
 * - User Login page (simple stub, no backend)
 * - Modern Kollywood-inspired theme (uses provided and custom colors)
 * - Navbar with app logo, navigation to home/quizzes, profile, and logout
 * - Responsive game mode selection grid
 * - Route-based rendering for all quiz game modes, with stub components
 * - Results page/modal stub
 * 
 * PUBLIC_INTERFACE
 */

//** Routing without dependencies: simple view state */
const VIEW = {
  LOGIN: "login",
  HOME: "home",
  POSTER: "poster",
  CHARACTER: "character",
  BINGO: "bingo",
  TIMELINE: "timeline",
  SPIN: "spin",
  CAST: "cast",
  REVERSE: "reverse",
  RESULTS: "results"
};

const QUIZ_MODES = [
  {
    key: VIEW.POSTER,
    name: "Blurred Poster Guess",
    desc: "Guess the movie from a blurred poster and clues.",
    color: "#fb00ff"
  },
  {
    key: VIEW.CHARACTER,
    name: "Character-Movie Match",
    desc: "Drag and drop characters to their movies.",
    color: "#02d6d1"
  },
  {
    key: VIEW.BINGO,
    name: "Movie Bingo",
    desc: "Pick all movies matching a fun category.",
    color: "#f76409"
  },
  {
    key: VIEW.TIMELINE,
    name: "Movie Timeline Challenge",
    desc: "Arrange movies by release date.",
    color: "#ffb400"
  },
  {
    key: VIEW.SPIN,
    name: "Spin the Wheel",
    desc: "Spin to get a combo and match the movie.",
    color: "#fb00ff"
  },
  {
    key: VIEW.CAST,
    name: "Cast Combo",
    desc: "Guess movie by actor combo (bonus: Reverse mode).",
    color: "#8236fa"
  }
];

// --- Styling (Scoped to this component) ---
const mainTheme = {
  "--primary": "#121212",
  "--secondary": "#fb00ff",
  "--accent": "#ffffff",
  "--kollywood-light": "#fb00ff",
  "--kollywood-accent": "#f8c102",
  "--kollywood-bg": "#121212"
};
// ------------------------------------------

/**
 * PUBLIC_INTERFACE
 */
function MainContainer() {
  // Fake login: just user string in state
  const [user, setUser] = useState(null);

  // Main view routing
  const [view, setView] = useState(VIEW.LOGIN);

  // Optionally: show results, pass scores, etc.
  const [results, setResults] = useState(null);

  // Handle login submit stub
  const handleLogin = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const username = form.get('username');
    if (username) {
      setUser({ name: username, avatar: defaultAvatar(username) });
      setView(VIEW.HOME);
    }
  };

  // Logging out
  const handleLogout = () => {
    setUser(null);
    setView(VIEW.LOGIN);
    setResults(null);
  };

  // Conditional rendering: Each game mode is its own component or stub
  function renderContent() {
    if (!user && view !== VIEW.LOGIN) {
      return null;
    }
    switch (view) {
      case VIEW.LOGIN:
        return <LoginView onLogin={handleLogin} />;
      case VIEW.HOME:
        return (
          <HomeView
            user={user}
            onSelectMode={setView}
            quizModes={QUIZ_MODES}
          />
        );
      case VIEW.POSTER:
        return <BlurredPosterGuess onBack={() => setView(VIEW.HOME)} onFinish={() => handleResultsStub("Blurred Poster Guess")} />;
      case VIEW.CHARACTER:
        return <CharacterMovieMatch onBack={() => setView(VIEW.HOME)} onFinish={() => handleResultsStub("Character-Movie Match")} />;
      case VIEW.BINGO:
        return <MovieBingo onBack={() => setView(VIEW.HOME)} onFinish={() => handleResultsStub("Movie Bingo")} />;
      case VIEW.TIMELINE:
        return <MovieTimelineChallenge onBack={() => setView(VIEW.HOME)} onFinish={() => handleResultsStub("Movie Timeline Challenge")} />;
      case VIEW.SPIN:
        return <SpinTheWheel onBack={() => setView(VIEW.HOME)} onFinish={() => handleResultsStub("Spin the Wheel")} />;
      case VIEW.CAST:
        return <CastCombo onBack={() => setView(VIEW.HOME)} onReverseMode={() => setView(VIEW.REVERSE)} onFinish={() => handleResultsStub("Cast Combo")} />;
      case VIEW.REVERSE:
        // Bonus: Reverse mode for Cast Combo
        return <ReverseCastComboStub onBack={() => setView(VIEW.CAST)} onFinish={() => handleResultsStub("Reverse Mode")} />;
      case VIEW.RESULTS:
        return <ResultsModal results={results} onHome={() => setView(VIEW.HOME)} />;
      default:
        return <div className="container">Unknown view.</div>;
    }
  }

  function handleResultsStub(mode) {
    setResults({ mode, score: Math.floor(Math.random() * 11), correct: Math.floor(Math.random() * 11) });
    setView(VIEW.RESULTS);
  }

  return (
    <div
      className="main-quiz-app"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#121212 60%,#2a0057 100%)",
        color: "#fff",
        ...mainTheme
      }}
    >
      <NavBar
        user={user}
        onHome={() => setView(VIEW.HOME)}
        onLogout={handleLogout}
        onProfile={() => alert("Profile feature coming soon!")}
        onLoginClick={() => setView(VIEW.LOGIN)}
        isHome={(view === VIEW.HOME)}
      />
      <main style={{ paddingTop: 94, minHeight: "80vh" }}>
        {renderContent()}
      </main>
      <footer
        style={{
          textAlign: "center",
          padding: "22px 0 14px 0",
          color: "rgba(255,255,255,0.5)",
          fontSize: "1rem",
        }}
      >
        Kollywood QuizMaster &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function NavBar({ user, onHome, isHome, onLogout, onProfile, onLoginClick }) {
  // The Kollywood stylized logo and navigation, with user profile/avatar and login/logout
  return (
    <nav
      className="navbar"
      style={{
        background: "rgba(18,18,18,0.95)",
        borderBottom: "2.5px solid #fb00ff",
        color: "#fb00ff",
        boxShadow: "0 3px 22px 0 #4f033d20",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        width: "100%",
        height: 70
      }}
    >
      <div className="container" style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div style={{display:"flex", alignItems:"center", gap:18, fontWeight:700}}>
          <span style={{
            fontSize:32,
            color:"#fb00ff",
            lineHeight: "1"
          }}>🎬</span>
          <span style={{ fontSize: "1.8rem", letterSpacing:"1.5px", color:"#fb00ff"}}>Kollywood QuizMaster</span>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:16}}>
          {user ? (
            <>
              {isHome ? null : (
                <button className="btn" style={navBtnStyle("#fb00ff")} onClick={onHome}>Home</button>
              )}
              <div style={{display:"flex", alignItems:"center", gap:10}}>
                <button className="btn" style={navBtnStyle("#02d6d1")} title="Profile" onClick={onProfile}>
                  <img
                    alt="user avatar"
                    src={user.avatar}
                    style={{width:36, height:36, objectFit:"cover", borderRadius:"50%", marginRight:7, border:"2px solid #fb00ff", verticalAlign:"middle"}}
                  /> {user.name}
                </button>
                <button className="btn" style={navBtnStyle("#f76409")} onClick={onLogout}>Logout</button>
              </div>
            </>
          ) : (
            <button className="btn" style={navBtnStyle("#fb00ff")} onClick={onLoginClick}>Login</button>
          )}
        </div>
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function LoginView({ onLogin }) {
  // Simple Kollywood-inspired themed login form
  return (
    <section className="container" style={{
      maxWidth:380, background: "rgba(18,6,30, .95)", margin:"120px auto 0", padding:40,
      borderRadius:18, border: "2.5px solid #fb00ff", boxShadow: "0px 0px 22px 0 #fb00ff33"
    }}>
      <h2 style={{color: "#fb00ff", marginBottom:20}}>
        Welcome to Kollywood QuizMaster!
      </h2>
      <form onSubmit={onLogin}>
        <label htmlFor="username" style={{fontWeight:600, letterSpacing:".5px"}}>Username</label>
        <input
          style={inputStyle}
          id="username"
          name="username"
          autoComplete="username"
          autoFocus
          required
          placeholder="Your Kollywood Nickname"
        />
        <button type="submit" className="btn btn-large" style={{marginTop:24, width:"100%"}}>
          Login and Play
        </button>
      </form>
    </section>
  );
}

// PUBLIC_INTERFACE
function HomeView({ user, quizModes, onSelectMode }) {
  // Home dashboard: list of quiz game modes to start a game
  return (
    <section className="container" style={{paddingTop: 40}}>
      <div style={{textAlign:"center", marginBottom:30}}>
        <h1 className="title" style={{marginBottom:12, fontSize:"2.9rem", color:"#fb00ff"}}>Vanakkam, {user.name}</h1>
        <div className="subtitle" style={{fontWeight:600, color:"#fb00ff", marginBottom:14}}>
          Choose a Game Mode
        </div>
        <p style={{color:"rgba(255,255,255,0.75)", fontSize:"1.08rem"}}>
          Test your Kollywood knowledge across unique quiz types—fresh clues in every mode!
        </p>
      </div>
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit, minmax(235px,1fr))",
        gap: "40px"
      }}>
        {quizModes.map(mode =>
          <GameModeCard
            key={mode.key}
            mode={mode}
            onPlay={() => onSelectMode(mode.key)}
          />
        )}
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function GameModeCard({ mode, onPlay }) {
  // Each quiz mode is visually attractive, Kollywood card
  return (
    <div style={{
      background: "linear-gradient(120deg, rgba(251,0,255,0.16) 0%,rgba(18,18,18,1) 86%)",
      borderRadius:22,
      border: `2px solid ${mode.color}`,
      boxShadow: `0 8px 32px 0 #fb00ff33`,
      padding:"34px 28px",
      display:"flex", flexDirection:"column", alignItems:"flex-start",
      transition:"transform .17s cubic-bezier(.22,1,.36,1)",
      cursor:"pointer",
    }} onClick={onPlay} tabIndex={0}>
      <h3 style={{color:mode.color, fontSize:"1.25rem", marginBottom:7, fontWeight:900,letterSpacing:".5px"}}>
        {mode.name}
      </h3>
      <div style={{color:"rgba(255,255,255,0.78)", fontSize:"1.05rem"}}>{mode.desc}</div>
      <button className="btn btn-large" style={{marginTop:18, background:mode.color}}>Play</button>
    </div>
  );
}

// PUBLIC_INTERFACE
// The stubs for ReverseCastCombo and GameStubContainer remain as placeholders.
function ReverseCastComboStub({ onBack, onFinish }) {
  return (
    <GameStubContainer
      title="Reverse Mode (Cast Combo)"
      desc="Identify the actor who does NOT belong in the given Kollywood movie. (Game stub for now!)"
      color="#f8c102"
      onBack={onBack}
      onFinish={onFinish}
    />
  );
}

// PUBLIC_INTERFACE
function GameStubContainer({ title, desc, color, onBack, onFinish, extra }) {
  // Generic stub for game mode placeholder
  return (
    <section className="container" style={{
      background:"rgba(18,6,30,.9)",
      borderRadius:18,
      border: `2.5px solid ${color}`,
      boxShadow: `0 8px 26px 0 ${color}33`,
      margin:"46px auto 22px",
      padding:"40px 23px 36px",
      maxWidth:520,
      minHeight:340,
      display:"flex",
      flexDirection:"column",
      alignItems:"center"
    }}>
      <h2 style={{color, fontSize:"2.2rem", margin:"2px 0 13px",fontWeight:900}}>{title}</h2>
      <div className="description" style={{color:"rgba(255,255,255,0.83)", textAlign:"center", marginBottom:28, fontSize:"1.08rem"}}>{desc}</div>
      {extra ? <div style={{marginBottom:14}}>{extra}</div> : null}
      <div style={{display:"flex", gap:22, marginTop:"auto"}}>
        <button className="btn" style={navBtnStyle(color)} onClick={onBack}>Back</button>
        <button className="btn" style={navBtnStyle("#02d6d1")} onClick={onFinish}>Finish</button>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function ResultsModal({ results, onHome }) {
  // Display results as a modal or page after each round
  if (!results) return null;
  const { mode, score, correct } = results;
  return (
    <section className="container" style={{
      background:"rgba(6,14,30,.97)", borderRadius:18,
      border: "2.5px solid #fb00ff", boxShadow: "0px 0px 22px 0 #fb00ff33",
      margin:"66px auto 22px", padding:"44px 23px 36px", maxWidth:480
    }}>
      <h2 style={{color:"#fb00ff", fontSize:"2.2rem", margin:"2px 0 7px",fontWeight:900}}>Results</h2>
      <div style={{fontSize:"1.1rem", margin:"16px 0 13px"}}>
        You finished: <span style={{color:"#fb00ff", fontWeight:700}}>{mode}</span>
      </div>
      <div style={{fontSize:"1.25rem", margin:"10px 0"}}>
        <span style={{color:"#f8c102", fontWeight:700, fontSize:"2.1rem"}}>{score}</span> / 10
      </div>
      <div style={{margin:"14px 0 25px", color:"rgba(255,255,255,0.7)"}}>
        Correct Answers: {correct}
        <br />
        (Stub data: real stats will be shown in future!)
      </div>
      <button className="btn btn-large" style={{background:"#fb00ff", color:"#fff"}} onClick={onHome}>Back to Home</button>
    </section>
  );
}

// --- UTILS ---
function navBtnStyle(bg, fg="#fff") {
  return {
    background: bg,
    color: fg,
    border: "none",
    borderRadius: 7,
    fontWeight: 600,
    fontSize: "1rem",
    padding: "7px 19px",
    margin: 0,
    cursor: "pointer",
    boxShadow: "0 2.5px 9px 0 #1f003666",
    transition: "background .12s cubic-bezier(.22,1,.36,1)",
    outline: "none"
  };
}
const inputStyle = {
  width:"100%",
  padding:"12px 12px",
  margin:"16px 0 0 0",
  border:"1.5px solid #fb00ff",
  borderRadius:8,
  fontSize:"1rem",
  background:"#181028",
  color:"#fff",
  fontWeight:500,
  letterSpacing:".5px"
};

function defaultAvatar(username) {
  // Returns generated avatar url for initials (fallback if not using a CDN)
  const colorSet = ["fb00ff","f8c102","02d6d1","f76409","8236fa","ffb400"];
  const index = Math.abs(hashCode(username)) % colorSet.length;
  const bg = colorSet[index];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=${bg}&color=fff&font-size=0.42&bold=true&rounded=true&size=128`;
}
function hashCode(str) {
  let hash = 0; for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash|=0; }
  return hash;
}

export default MainContainer;
