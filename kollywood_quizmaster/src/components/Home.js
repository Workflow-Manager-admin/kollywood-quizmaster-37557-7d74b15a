import React from "react";
import './Home.css';

// Game mode configs (names/icons match App.js order)
const MODES = [
  {
    key: "blurred-poster",
    label: "Blurred Poster Guess",
    desc: "Guess the movie from a blurred poster and two clues!",
    icon: "🖼️",
  },
  {
    key: "character-match",
    label: "Character-Movie Match",
    desc: "Match Kollywood characters to their movies.",
    icon: "👤",
  },
  {
    key: "movie-bingo",
    label: "Movie Bingo",
    desc: "Pick all movies matching a given category.",
    icon: "🎲",
  },
  {
    key: "timeline",
    label: "Timeline Challenge",
    desc: "Arrange movies by release year.",
    icon: "⏳",
  },
  {
    key: "spin-the-wheel",
    label: "Spin the Wheel",
    desc: "Spin & guess – actor, actress, year!",
    icon: "🌀",
  },
  {
    key: "cast-combo",
    label: "Cast Combo",
    desc: "Guess by actor combo or find the odd one out.",
    icon: "👥",
  },
];

// PUBLIC_INTERFACE
/**
 * Home screen – shows mode selection cards.
 * @param {{movies: Array, loading: boolean, onSelectGame: Function, username: string}} props
 */
function Home({ movies, loading, onSelectGame, username }) {
  return (
    <div className="home-panel glass-panel">
      <div className="home-header">
        <div className="subtitle">Hello, <b>{username}</b>!</div>
        <h1 className="title">Pick Your Kollywood Quiz Mode</h1>
        <p className="description">
          Challenge yourself across six game types featuring real Kollywood data.<br/>
          {loading ? <em>Loading movie data...</em>
            : <span className="movie-count">({movies.length} Kollywood movies loaded)</span>}
        </p>
      </div>
      <div className="game-cards-grid">
        {MODES.map(mode => (
          <div key={mode.key} className="game-mode-card" tabIndex={0}
            onClick={() => onSelectGame(mode.key)}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelectGame(mode.key)}
            aria-label={`Play ${mode.label}`}
          >
            <div className="mode-icon">{mode.icon}</div>
            <div className="mode-title">{mode.label}</div>
            <div className="mode-desc">{mode.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Home;
