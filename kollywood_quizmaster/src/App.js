import React, { useState } from 'react';
import './App.css';

// Component imports
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import BlurredPosterGuess from './components/BlurredPosterGuess';
import CharacterMovieMatch from './components/CharacterMovieMatch';
import MovieBingo from './components/MovieBingo';
import MovieTimeline from './components/MovieTimeline';
import SpinTheWheel from './components/SpinTheWheel';
import CastCombo from './components/CastCombo';
import ResultsModal from './components/ResultsModal';

// Default stub data for demonstration (replace with real data or API integration for production)
const demoUser = { username: "kollywoodfan" };

// Main available game modes
const GAME_MODES = [
  { key: 'blurred-poster', name: 'Blurred Poster Guess', icon: '🖼️' },
  { key: 'char-movie', name: 'Character-Movie Match', icon: '🎭' },
  { key: 'bingo', name: 'Movie Bingo', icon: '🏆' },
  { key: 'timeline', name: 'Movie Timeline', icon: '⏳' },
  { key: 'spin', name: 'Spin the Wheel', icon: '🎡' },
  { key: 'cast-combo', name: 'Cast Combo', icon: '👥' },
];

function App() {
  // Auth and user state
  const [user, setUser] = useState(null);
  // Current selected game mode state
  const [mode, setMode] = useState(null);
  // Results modal state
  const [results, setResults] = useState(null);
  // User progress/profile placeholder
  const [profileShown, setProfileShown] = useState(false);

  // Handles user login
  // PUBLIC_INTERFACE
  function handleLogin(credentials) {
    // Simulate login success
    setUser({ username: credentials.username });
    setMode(null);
  }

  // Handles logout
  // PUBLIC_INTERFACE
  function handleLogout() {
    setUser(null);
    setMode(null);
    setProfileShown(false);
    setResults(null);
  }

  // Handles showing result modal
  // PUBLIC_INTERFACE
  function showResults(resultsData) {
    setResults(resultsData);
  }

  // Handles closing the result modal
  // PUBLIC_INTERFACE
  function closeResults() {
    setResults(null);
    setMode(null); // Return to home after displaying results
  }

  // Handles returning to home
  // PUBLIC_INTERFACE
  function goToHome() {
    setMode(null);
    setResults(null);
  }

  // Handles opening user profile
  // PUBLIC_INTERFACE
  function openProfile() {
    setProfileShown(true);
  }
  // Handles closing profile
  // PUBLIC_INTERFACE
  function closeProfile() {
    setProfileShown(false);
  }

  // Renders the correct game screen based on current mode
  function renderGame() {
    switch (mode) {
      case 'blurred-poster':
        return <BlurredPosterGuess onFinish={showResults} />;
      case 'char-movie':
        return <CharacterMovieMatch onFinish={showResults} />;
      case 'bingo':
        return <MovieBingo onFinish={showResults} />;
      case 'timeline':
        return <MovieTimeline onFinish={showResults} />;
      case 'spin':
        return <SpinTheWheel onFinish={showResults} />;
      case 'cast-combo':
        return <CastCombo onFinish={showResults} />;
      default:
        return null;
    }
  }

  return (
    <div className="app" style={{ background: "var(--base-dark)" }}>
      <Navbar
        user={user}
        onLogout={handleLogout}
        onProfile={openProfile}
        onHome={goToHome}
      />
      <main>
        <div className="container" style={{ marginTop: 100 }}>
          {/* Login flow */}
          {!user && (
            <Login onLogin={handleLogin} />
          )}
          {/* Show profile modal */}
          {user && profileShown && (
            <ProfileModal user={user} onClose={closeProfile} />
          )}
          {/* Home with game mode selection */}
          {user && !mode && !profileShown && (
            <Home
              username={user.username}
              modes={GAME_MODES}
              onSelectMode={setMode}
            />
          )}
          {/* Game Area */}
          {user && mode && renderGame()}
          {/* Results Modal */}
          {results && (
            <ResultsModal
              results={results}
              onClose={closeResults}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Simple profile modal for demonstration
function ProfileModal({ user, onClose }) {
  return (
    <div className="modal-bg">
      <div className="modal">
        <h2>User Profile</h2>
        <p><b>Username:</b> {user.username}</p>
        <button className="btn" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default App;
