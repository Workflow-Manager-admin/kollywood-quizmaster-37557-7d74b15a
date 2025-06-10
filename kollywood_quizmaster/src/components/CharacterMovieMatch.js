import React, { useState } from 'react';

// These demo questions omit validation; use proper randomization & unique per round for real data
const DATA = [
  {
    characters: [
      { name: "Anniyan", movie: "Anniyan" },
      { name: "Baasha", movie: "Baasha" },
      { name: "Chitti", movie: "Enthiran" }
    ],
    movies: ["Anniyan", "Baasha", "Enthiran"]
  }
  // Add more sets for 10 rounds in real usage
];

// PUBLIC_INTERFACE
function CharacterMovieMatch({ onFinish }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attempts, setAttempts] = useState([]);
  const [score, setScore] = useState(0);

  const current = DATA[index];
  if (!current) return <div>Loading...</div>;

  // Handle drag and drop mapping
  function handleDrop(character, movie) {
    setAnswers(ans => ({ ...ans, [character]: movie }));
  }

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    let c = 0;
    current.characters.forEach(char => {
      if (answers[char.name] === char.movie) c++;
    });
    setScore(s => s + c);
    setAttempts([...attempts, { ...answers, correct: c }]);
    if (index < DATA.length - 1) {
      setIndex(idx => idx + 1);
      setAnswers({});
    } else {
      onFinish({ score: score + c, attempts: [...attempts, { ...answers, correct: c }], game: "Character-Movie Match" });
    }
  }

  return (
    <section>
      <h2>Character-Movie Match</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "row", gap: 44, justifyContent: "center", alignItems: "flex-start", marginBottom: 15 }}>
          <div>
            <h3>Characters</h3>
            {current.characters.map((char, i) => (
              <Draggable key={char.name} name={char.name} />
            ))}
          </div>
          <div>
            <h3>Movies</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {current.movies.map((movie, i) => (
                <Droppable
                  key={movie}
                  movie={movie}
                  onDropCharacter={charName => handleDrop(charName, movie)}
                  assignedCharacter={
                    Object.entries(answers).find(([k, v]) => v === movie)?.[0] || null
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <button
          className="btn"
          type="submit"
          style={{ marginTop: 18 }}
          disabled={Object.keys(answers).length !== current.characters.length}
        >
          Submit Answers
        </button>

        <div style={{ textAlign: "right", marginTop: 24, color: '#fb00ff', fontStyle: 'italic', fontSize: 17 }}>
          Score: {score}
        </div>
      </form>
    </section>
  );
}

// Simple draggable (no external libs used)
function Draggable({ name }) {
  function handleDragStart(e) {
    e.dataTransfer.setData("app/charname", name);
  }
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        background: "#181d23",
        color: "#fb00ff",
        border: "1px solid #fb00ff",
        borderRadius: 7,
        padding: "7px 18px",
        margin: "8px 0",
        fontWeight: 500,
        cursor: "grab"
      }}
    >{name}</div>
  );
}

function Droppable({ movie, onDropCharacter, assignedCharacter }) {
  function handleDrop(e) {
    e.preventDefault();
    const char = e.dataTransfer.getData("app/charname");
    if (char) onDropCharacter(char);
  }
  function handleDragOver(e) {
    e.preventDefault();
  }
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        background: "#222",
        border: "2px dashed #fb00ff",
        borderRadius: 7,
        minHeight: 46,
        minWidth: 140,
        marginBottom: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        color: "#fff"
      }}>
      <b>{movie}</b> &nbsp; {assignedCharacter && (
        <span style={{
          marginLeft: 12,
          color: "var(--base-light)",
          background: "#242",
          borderRadius: 5,
          padding: "3px 9px",
          fontSize: 15
        }}>{assignedCharacter}</span>
      )}
    </div>
  );
}

export default CharacterMovieMatch;
