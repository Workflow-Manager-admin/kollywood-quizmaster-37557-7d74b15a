import React, { useState } from "react";
import "./App.css";
import "./kollywood.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { QuizProvider } from "./context/QuizContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ResultsModal from "./components/ResultsModal";

// Game imports
import BlurredPosterGuess from "./pages/games/BlurredPosterGuess";
import CharacterMovieMatch from "./pages/games/CharacterMovieMatch";
import MovieBingo from "./pages/games/MovieBingo";
import MovieTimelineChallenge from "./pages/games/MovieTimelineChallenge";
import SpinTheWheel from "./pages/games/SpinTheWheel";
import CastCombo from "./pages/games/CastCombo";

// Routing state machine (no react-router, pure state since SPA)
function AppShell() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState(user ? "home" : "login");
  const [game, setGame] = useState(null);

  // After logout
  React.useEffect(() => {
    if (!user) {
      setPage("login");
      setGame(null);
    }
  }, [user]);

  function handleNav(newPage) {
    setPage(newPage);
    setGame(null);
  }
  function handleGameMode(mode) {
    setGame(mode);
    setPage("game");
  }
  function handleQuitGame() {
    setGame(null);
    setPage("home");
  }

  return (
    <div className="app" style={{ background: "#faf6ff", minHeight: "100vh" }}>
      <Navbar onNav={setPage} onLogout={logout} active={page} />
      <main style={{ paddingTop: 70 }}>
        {(!user || page === "login") && <Login />}
        {user && !game && page === "home" && <Home onSelectMode={handleGameMode} />}
        {user && !game && page === "profile" && <Profile />}
        {user && page === "game" && (() => {
          switch (game) {
            case "blurred-poster": return <BlurredPosterGuess onQuit={handleQuitGame} />;
            case "character-match": return <CharacterMovieMatch onQuit={handleQuitGame} />;
            case "movie-bingo": return <MovieBingo onQuit={handleQuitGame} />;
            case "timeline-challenge": return <MovieTimelineChallenge onQuit={handleQuitGame} />;
            case "spin-the-wheel": return <SpinTheWheel onQuit={handleQuitGame} />;
            case "cast-combo": return <CastCombo onQuit={handleQuitGame} />;
            default: return <Home onSelectMode={handleGameMode} />;
          }
        })()}
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <AppShell />
      </QuizProvider>
    </AuthProvider>
  );
}
export default App;
