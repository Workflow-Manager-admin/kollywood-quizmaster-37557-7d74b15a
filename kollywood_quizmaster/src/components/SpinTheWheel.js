import React, { useState } from 'react';

// Demo list of movie/actor/year
const WHEEL_ACTORS = ["Rajinikanth", "Vijay", "Samantha", "Suriya", "Kamal Haasan"];
const WHEEL_ACTRESSES = ["Nayanthara", "Jyothika", "Trisha", "Amala Paul", "Simran"];
const WHEEL_YEARS = [2005, 2010, 2013, 2016, 2021];

// One match per demo round
const SOLUTIONS = {
  "Kamal Haasan": {
    "Simran": {
      "2001": "Panchathanthiram"
    }
  },
  "Rajinikanth": {
    "Nayanthara": {
      "2016": "Kabali"
    }
  }
};

// PUBLIC_INTERFACE
function SpinTheWheel({ onFinish }) {
  const [actor, setActor] = useState(null);
  const [actress, setActress] = useState(null);
  const [year, setYear] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  // PUBLIC_INTERFACE
  function handleSpin() {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      setActor(WHEEL_ACTORS[Math.floor(Math.random() * WHEEL_ACTORS.length)]);
      setActress(WHEEL_ACTRESSES[Math.floor(Math.random() * WHEEL_ACTRESSES.length)]);
      setYear(WHEEL_YEARS[Math.floor(Math.random() * WHEEL_YEARS.length)]);
    }, 800);
  }

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    setAnswered(true);
    let corr = false;
    if (
      SOLUTIONS[actor] &&
      SOLUTIONS[actor][actress] &&
      SOLUTIONS[actor][actress][String(year)] &&
      guess.trim().toLowerCase() === SOLUTIONS[actor][actress][String(year)].toLowerCase()
    ) {
      setScore(1);
      corr = true;
    }
    onFinish({ score: corr ? 1 : 0, attempts: [{ actor, actress, year, guess, correct: corr }], game: "Spin the Wheel" });
  }

  return (
    <section>
      <h2>Spin the Wheel</h2>
      <div className="subtitle">Spin for clues: actor, actress &amp; year!</div>
      <div style={{ display: "flex", gap: 22, margin: "22px 0", justifyContent: "center", alignItems: "center" }}>
        <Wheel label="Actor" value={actor} spinning={spinning} />
        <Wheel label="Actress" value={actress} spinning={spinning} />
        <Wheel label="Year" value={year} spinning={spinning} />
      </div>
      <button className="btn btn-large" style={{marginBottom: 16}} disabled={spinning} onClick={handleSpin}>
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {(actor && actress && year) && (
        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
          <input
            className="input"
            style={{ ...inputStyle, width: 240 }}
            value={guess}
            onChange={e => setGuess(e.target.value)}
            placeholder="Guess the Movie"
            autoFocus
          />
          <button className="btn" type="submit" style={{marginLeft:10}}>Submit</button>
        </form>
      )}
    </section>
  )
}

function Wheel({ label, value, spinning }) {
  return (
    <div style={{
      width: 105, height: 105, background: "#19191e", borderRadius: "50%",
      border: "4px solid #fb00ff", display: "flex", alignItems: "center",
      justifyContent: "center", flexDirection: "column"
    }}>
      <span style={{
        color: "#fb00ff", fontWeight: 700, fontSize: 16, marginBottom: 7
      }}>{label}</span>
      <span style={{
        color: "#fff", fontSize: 23, minHeight: 28
      }}>{spinning ? <span style={{opacity:.8}}>...</span> : (value || "--")}</span>
    </div>
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

export default SpinTheWheel;
