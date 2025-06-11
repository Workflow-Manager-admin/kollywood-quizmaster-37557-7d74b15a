import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [err, setErr] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setErr("Username must be at least 3 characters");
      return;
    }
    login(username.trim());
  };

  return (
    <div style={{ display: "flex", minHeight: "80vh", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleLogin} style={{ background: "#fff", padding: 33, borderRadius: 10, minWidth: 300, boxShadow: "0 8px 46px #4e1e579a" }}>
        <h2 className="kollywood-game-header">Login</h2>
        <input
          type="text"
          placeholder="Kollywood Fan Name"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 5, border: "1px solid #c6b7ee", marginBottom: 18, fontSize: 17 }}
          autoFocus
        />
        {err && <div style={{ color: "#ea1a33", marginBottom: 8, fontSize: 15 }}>{err}</div>}
        <button className="kollywood-btn" style={{ width: "100%" }}>Login</button>
        <div style={{ fontSize: 13, color: "#cf69fe", marginTop: 14 }}>No backend—your progress is local!</div>
      </form>
    </div>
  );
}

export default Login;
