import React, { useState } from "react";
import './Login.css';

// PUBLIC_INTERFACE
/**
 * Simple login form for Kollywood QuizMaster.
 * Accepts a username. Authentication can be expanded later.
 * @param {{onSuccess: function({username:string}):void}} props
 */
function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError("Enter at least 3 characters.");
      return;
    }
    setError(null);
    onSuccess({ username: username.trim() });
  }

  return (
    <div className="login-panel glass-panel">
      <div className="big-logo-text"><span className="logo-symbol">*</span> Kollywood QuizMaster</div>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          <span>Username:</span>
          <input
            autoFocus
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter your name"
            autoComplete="username"
            required
          />
        </label>
        {error && <div className="login-err">{error}</div>}
        <button className="btn btn-large glow" type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
