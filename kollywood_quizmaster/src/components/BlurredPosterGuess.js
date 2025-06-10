import React, { useState } from 'react';

// Demo data for 1 round (replace with real API/DB in future)
const QUESTIONS = [
  {
    imgUrl: "https://i.imgur.com/tVMzl0O.jpg", // Blurred sample movie poster URL
    clues: ["Comedy blockbuster, 2010s", "Starred the iconic comedian Vadivelu"],
    answer: "Imsai Arasan 23am Pulikesi"
  },
  {
    imgUrl: "https://i.imgur.com/rUssWxI.jpg",
    clues: ["Romantic musical, 2000s", "Oscar-winning composer"],
    answer: "Alaipayuthey"
  }
  // ... (add 8 more for real play)
];

// PUBLIC_INTERFACE
function BlurredPosterGuess({ onFinish }) {
  const [round, setRound] = useState(0);
  const [guess, setGuess] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState([]);

  const current = QUESTIONS[round];

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    if (!current) return;
    if (guess.trim().toLowerCase() === current.answer.toLowerCase()) {
      setScore(s => s + 1);
      next(true);
    } else {
      next(false);
    }
  }

  function next(isCorrect) {
    setAttempts([...attempts, { answer: current.answer, guess, isCorrect, clues: current.clues }]);
    setGuess('');
    setRevealed(false);
    if (round < QUESTIONS.length - 1) {
      setRound(r => r + 1);
    } else {
      onFinish({ score: isCorrect ? score + 1 : score, attempts: [...attempts, { answer: current.answer, guess, isCorrect, clues: current.clues }], game: "Blurred Poster Guess" });
    }
  }

  function handleReveal() {
    setRevealed(true);
  }

  if (!current) return <div>Loading...</div>;

  return (
    <section>
      <h2>Blurred Poster Guess</h2>
      <div style={{ marginBottom: 20, marginTop: 5 }}>Round {round + 1} / {QUESTIONS.length}</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <img src={current.imgUrl}
          alt="Blurred Movie Poster"
          style={{ filter: revealed ? "none" : "blur(18px)", width: 220, height: 320, objectFit: "cover", borderRadius: 12, marginBottom: 10, border: "3px solid #fb00ff" }} />
        <div>
          <b>Clues:</b>
          <ul style={{ color: '#fb00ff', marginTop: 4 }}>
            {current.clues.map((clue, i) => <li key={i}>{clue}</li>)}
          </ul>
        </div>
        <form style={{ display: 'flex', flexDirection: 'row', gap: 8, marginTop: 4 }} onSubmit={handleSubmit}>
          <input
            type="text"
            className="input"
            style={inputStyle}
            value={guess}
            onChange={e => setGuess(e.target.value)}
            placeholder="Your Answer"
          />
          <button className="btn" type="submit" disabled={revealed}>Guess</button>
        </form>
        {!revealed && <button className="btn" style={{ background: "#333" }} type="button" onClick={handleReveal}>Reveal Answer</button>}
        {revealed && <div style={{ color: '#fb00ff', marginTop: 7 }}>Answer: <b>{current.answer}</b></div>}
        {revealed && <button className="btn" style={{ marginTop: 12 }} onClick={() => next(false)}>Next</button>}
      </div>
      <div style={{ textAlign: "right", marginTop: 24, color: '#fb00ff', fontStyle: 'italic', fontSize: 17 }}>Score: {score}</div>
    </section>
  );
}

const inputStyle = {
  padding: "10px 14px",
  fontSize: "1rem",
  borderRadius: 4,
  border: '1px solid #fb00ff',
  background: "#181d23",
  color: '#fff'
};

export default BlurredPosterGuess;
