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

// List of game routes and their matching components
const GAME_MODES = [
  { key: 'blurred-poster', name: 'Blurred Poster Guess', component: BlurredPosterGuess },
  { key: 'character-match', name: 'Character-Movie Match', component: CharacterMovieMatch },
  { key: 'movie-bingo', name: 'Movie Bingo', component: MovieBingo },
  { key: 'timeline', name: 'Movie Timeline Challenge', component: MovieTimeline },
  { key: 'spin-the-wheel', name: 'Spin the Wheel', component: SpinTheWheel },
  { key: 'cast-combo', name: 'Cast Combo', component: CastCombo },
];

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
    // Load Kollywood movies on mount
    fetchKollywoodMovies()
      .then(data => {
        setKollywoodMovies(data.results || []);
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
  } else if (results) {
    content = (
      <div className="fade-in-panel">
        <ResultsDisplay results={results} onHome={() => setResults(null)} />
      </div>
    );
  } else if (activeGame) {
    // Find the component for the selected game mode
    const gameDef = GAME_MODES.find(mode => mode.key === activeGame);
    const GameComponent = gameDef?.component;
    if (!GameComponent) {
      content = <div className="panel error">Game mode not found.</div>;
    } else {
      content = (
        <div className="fade-in-panel">
          <GameComponent
            movies={kollywoodMovies}
            loading={loadingMovies}
            user={user}
            onGameEnd={handleGameEnd}
            onBack={() => setActiveGame(null)}
          />
        </div>
      );
    }
  } else {
    // Home: show all game cards
    content = (
      <div className="fade-in-panel">
        <Home
          movies={kollywoodMovies}
          loading={loadingMovies}
          onSelectGame={handleSelectGame}
          username={user?.username}
        />
      </div>
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
