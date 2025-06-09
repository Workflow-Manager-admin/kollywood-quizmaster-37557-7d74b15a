import React, { useState, useEffect } from 'react';
import './App.css';
import backgroundImg from './assets/background.jpg';
import { fetchKollywoodMovies } from './api';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import BlurredPosterGuess from './components/BlurredPosterGuess';
import CharacterMovieMatch from './components/CharacterMovieMatch';
import MovieBingo from './components/MovieBingo';
import MovieTimeline from './components/MovieTimeline';
import SpinTheWheel from './components/SpinTheWheel';
import CastCombo from './components/CastCombo';
import ResultsDisplay from './components/ResultsDisplay';
import { MovieSessionProvider, useMovieSession } from './MovieSessionContext';

// List of game routes and their matching components
const GAME_MODES = [
  { key: 'blurred-poster', name: 'Blurred Poster Guess', component: BlurredPosterGuess },
  { key: 'character-match', name: 'Character-Movie Match', component: CharacterMovieMatch },
  { key: 'movie-bingo', name: 'Movie Bingo', component: MovieBingo },
  { key: 'timeline', name: 'Movie Timeline Challenge', component: MovieTimeline },
  { key: 'spin-the-wheel', name: 'Spin the Wheel', component: SpinTheWheel },
  { key: 'cast-combo', name: 'Cast Combo', component: CastCombo },
];

function GameRouter({ activeGame, user, onGameEnd, onBack, onSelectGame, results }) {
  // We are inside MovieSessionProvider here and can useMovieSession if needed

  const { sessionInitialized, initializeSession, resetSession, claimMoviesForRound, claimNextMovie, wasMovieClaimed, remainingCount, claimedIds } =
    useMovieSession();

  // Map mode key to component
  if (results) {
    return (
      <div className="fade-in-panel">
        <ResultsDisplay results={results} onHome={resetSession} />
      </div>
    );
  }

  if (activeGame) {
    const gameDef = GAME_MODES.find(mode => mode.key === activeGame);
    const GameComponent = gameDef?.component;
    if (!GameComponent) {
      return <div className="panel error">Game mode not found.</div>;
    }
    // Instead of passing movies, pass claim helpers or null as fallback for stubs
    return (
      <div className="fade-in-panel">
        <GameComponent
          loading={false} // stub: movie loading should be handled prior
          user={user}
          onGameEnd={onGameEnd}
          onBack={onBack}
          // Below: context functions for each mode (to be used in real game logic)
          claimMoviesForRound={claimMoviesForRound}
          claimNextMovie={claimNextMovie}
          sessionInitialized={sessionInitialized}
          initializeSession={initializeSession}
          wasMovieClaimed={wasMovieClaimed}
          remainingCount={remainingCount}
          claimedIds={claimedIds}
        />
      </div>
    );
  }
  // Home screen stub: movie count is derived from session context
  return (
    <div className="fade-in-panel">
      <Home
        movies={[]} // real games should use the context
        loading={false}
        onSelectGame={onSelectGame}
        username={user?.username}
      />
    </div>
  );
}

function App() {
  // Login state (null = not logged in)
  const [user, setUser] = useState(null);
  // Current selected game mode; null for home
  const [activeGame, setActiveGame] = useState(null);
  // Results (set at end of game)
  const [results, setResults] = useState(null);

  // Fetched movie data (shared to quiz modes)
  const [kollywoodMovies, setKollywoodMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  useEffect(() => {
    // Load Kollywood movies on mount (filtered to moderate difficulty)
    fetchKollywoodMovies()
      .then(data => {
        setKollywoodMovies(Array.isArray(data.results) ? data.results : []);
        setLoadingMovies(false);
      })
      .catch(_err => setLoadingMovies(false));
  }, []);

  // Game mode selection
  function handleSelectGame(modeKey) {
    setActiveGame(modeKey);
    setResults(null);
  }

  // Logout handler
  function handleLogout() {
    setUser(null);
    setActiveGame(null);
    setResults(null);
  }

  // Handle game end
  function handleGameEnd(resultData) {
    setResults(resultData);
    setActiveGame(null); // go to results
  }

  // Decide which page/component to show based on login & mode
  let content;

  if (!user) {
    content = (
      <div className="centered-content">
        <Login onSuccess={setUser} />
      </div>
    );
  } else if (loadingMovies) {
    // Only show loading spinner (not games) while fetching movies on first login
    content = <div className="centered-content"><em>Loading movie data...</em></div>;
  } else {
    // Wrapping everything post-login in MovieSessionProvider using loaded movie pool
    content = (
      <MovieSessionProvider movies={kollywoodMovies}>
        <GameRouter
          activeGame={activeGame}
          user={user}
          onGameEnd={handleGameEnd}
          onBack={() => setActiveGame(null)}
          onSelectGame={handleSelectGame}
          results={results}
        />
        {/* Home uses onBack as goto-home, results uses resetSession when leaving results in GameRouter */}
        {/* Note: For game start, GameRouter will handle session resume/init logic */}
      </MovieSessionProvider>
    );
  }

  return (
    <div
      className="app"
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: `linear-gradient(0deg, rgba(18,18,18,.9) 0%, rgba(251,0,255,.35) 120%), url(${backgroundImg}) center/cover no-repeat fixed`,
        color: 'var(--text-color)'
      }}
    >
      <Navbar user={user} onLogout={handleLogout} />
      <main className="main-content">
        {content}
      </main>
    </div>
  );
}

export default App;
