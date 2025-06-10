import React, { useState } from 'react';

// PUBLIC_INTERFACE
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // Not checked in demo
  const [err, setErr] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!username) {
      setErr("Enter a username");
      return;
    }
    // Demo: No password check
    onLogin({username});
  }

  return (
    <div className="hero">
      <div className="subtitle">Login to Play</div>
      <h1 className="title">Kollywood QuizMaster</h1>
      {err && <div className="description" style={{ color: "#fb00ff" }}>{err}</div>}
      <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column', alignItems:'center',gap:12,marginTop:16}}>
        <input className="input" style={inputStyle} value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" autoFocus />
        <input className="input" style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button className="btn btn-large" type="submit">Login</button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "10px 16px",
  fontSize: "1.05rem",
  borderRadius: 4,
  border: '1px solid #fb00ff',
  width: 220,
  marginBottom: 5
};

export default Login;
