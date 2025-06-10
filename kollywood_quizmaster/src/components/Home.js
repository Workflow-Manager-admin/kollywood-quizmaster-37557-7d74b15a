import React from 'react';

// PUBLIC_INTERFACE
function Home({ username, modes, onSelectMode }) {
  return (
    <div className="hero">
      <div className="subtitle">Welcome, {username}!</div>
      <h1 className="title">Choose a Game Mode</h1>
      <div className="description">
        Test your Kollywood knowledge with diverse, fun quiz games! Each game has 10 unique questions.
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 24,
        marginTop: 24,
        width: "100%"
      }}>
        {modes.map((mode) => (
          <div key={mode.key}
            className="game-card"
            onClick={() => onSelectMode(mode.key)}
            style={{
              background: "linear-gradient(120deg, #121212 70%, #fb00ff 120%)",
              color: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 12px #30004922",
              padding: "30px 20px",
              cursor: "pointer",
              transition: "transform .12s",
              border: "1px solid #fb00ff",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 6 }}>{mode.icon}</div>
            <b>{mode.name}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
