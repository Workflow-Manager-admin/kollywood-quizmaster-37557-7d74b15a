import React, { useState } from 'react';

// Demo data for cast-combo (real data would rotate per round)
const QUESTIONS = [
  {
    mode: 'normal',
    actors: ["Suriya", "Jyothika", "Vadivelu"],
    answer: "Kaakha Kaakha"
  },
  {
    mode: 'reverse',
    actors: ["Vijay", "Trisha", "Nayanthara"],
    notIn: "Jilla",
    answer: "Nayanthara"
  }
];

// PUBLIC_INTERFACE
function CastCombo({ onFinish }) {
  const [qIdx, setQIdx] = useState(0);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState([]);

  const q = QUESTIONS[qIdx];

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    let corr = false;
    if (q.mode === "normal" && guess.trim().toLowerCase() === q.answer.toLowerCase()) {
      setScore(s => s + 1);
      corr = true;
    }
    if (q.mode === "reverse" && guess.trim().toLowerCase() === q.answer.toLowerCase()) {
      setScore(s => s + 1);
      corr = true;
    }
    setAttempts([...attempts, { ...q, guess, correct: corr }]);
    setGuess('');
    if (qIdx < QUESTIONS.length - 1) {
      setQIdx(idx => idx + 1);
    } else {
      onFinish({
        score: corr ? score + 1 : score,
        attempts: [...attempts, { ...q, guess, correct: corr }],
        game: "Cast Combo"
      });
    }
  }

  if (!q) return <div>Loading...</div>;

  return (
    <section>
      <h2>Cast Combo</h2>
      {q.mode === "normal" ? (
        <>
          <div style={{ margin: "10px 0 16px 0" }}>
            <b>Which movie starred all:</b>
            <ul style={{ color: "#fb00ff", marginTop: 6 }}>
              {q.actors.map(a => <li key={a}>{a}</li>)}
            </ul>
          </div>
        </>
      ) : (
        <>
          <div style={{ margin: "10px 0 16px 0" }}>
            <b>Which actor/actress <span style={{ color: "#fb00ff" }}>was NOT</span> part of <b>{q.notIn}</b> among:</b>
            <ul style={{ color: "#fb00ff", marginTop: 6 }}>
              {q.actors.map(a => <li key={a}>{a}</li>)}
            </ul>
          </div>
        </>
      )}
      <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
        <input
          className="input"
          style={inputStyle}
          value={guess}
          onChange={e => setGuess(e.target.value)}
          placeholder={q.mode === "normal" ? "Movie Name" : "Actor/Actress Name"}
        />
        <button className="btn" type="submit" style={{ marginLeft: 10 }}>Submit</button>
      </form>
      <div style={{ textAlign: "right", marginTop: 24, color: '#fb00ff', fontStyle: 'italic', fontSize: 17 }}>
        Score: {score}
      </div>
    </section>
  )
}

const inputStyle = {
  padding: "10px 14px",
  fontSize: "1rem",
  borderRadius: 4,
  border: '1px solid #fb00ff',
  background: "#181d23",
  color: '#fff'
};

export default CastCombo;
