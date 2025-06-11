import React from "react";
import GameModeCard from "../components/GameModeCard";

const MODES = [
  {
    id: "blurred-poster",
    icon: "poster",
    title: "Blurred Poster Guess",
    subtitle: "Guess the movie from a blurred poster and two clues."
  },
  {
    id: "character-match",
    icon: "character",
    title: "Character-Movie Match",
    subtitle: "Drag-and-drop: Put characters in their movies!"
  },
  {
    id: "movie-bingo",
    icon: "bingo",
    title: "Movie Bingo",
    subtitle: "Click movies matching the categories."
  },
  {
    id: "timeline-challenge",
    icon: "timeline",
    title: "Movie Timeline Challenge",
    subtitle: "Arrange movies in the correct release order."
  },
  {
    id: "spin-the-wheel",
    icon: "spin",
    title: "Spin the Wheel",
    subtitle: "Spin and guess: actor, actress, year, and movie!"
  },
  {
    id: "cast-combo",
    icon: "cast",
    title: "Cast Combo",
    subtitle: "Guess the movie from the 2–3 actor combo. (Bonus: Reverse)"
  },
];

function Home({ onSelectMode }) {
  return (
    <div>
      <div className="kollywood-home-grid">
        {MODES.map(mode => <GameModeCard key={mode.id} mode={mode} onClick={onSelectMode} />)}
      </div>
      <div style={{ textAlign: 'center', color: '#b687fd', marginTop: 40 }}>
        <em>Kollywood QuizMaster – Powered by TMDb</em>
      </div>
    </div>
  );
}

export default Home;
