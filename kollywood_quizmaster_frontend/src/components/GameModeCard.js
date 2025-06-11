import React from "react";

const icons = {
  "poster": "🖼️",
  "character": "🎭",
  "bingo": "🎲",
  "timeline": "⏳",
  "spin": "🎡",
  "cast": "🤝"
};

// PUBLIC_INTERFACE
function GameModeCard({ mode, onClick }) {
  return (
    <div className="kollywood-card" onClick={() => onClick(mode.id)}>
      <div style={{ fontSize: 44, marginBottom: 14 }}>{icons[mode.icon] || "🎬"}</div>
      <div style={{ fontWeight: 700, fontSize: 21 }}>{mode.title}</div>
      <div style={{ fontSize: 15, color: "#999", marginTop: 9 }}>{mode.subtitle}</div>
    </div>
  );
}

export default GameModeCard;
