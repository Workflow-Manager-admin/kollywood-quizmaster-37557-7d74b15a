import React from "react";
import { useAuth } from "../context/AuthContext";
import Theme from "../theme";

// PUBLIC_INTERFACE
function Navbar({ onNav, onLogout, active }) {
  const { user } = useAuth();

  return (
    <nav className="kollywood-navbar" style={{ background: Theme.primary, color: Theme.kollywoodGold }}>
      <div className="kollywood-logo" style={{ color: Theme.kollywoodGold }}>
        <span role="img" aria-label="🎬" style={{ fontWeight: 700 }}>🎬</span> Kollywood QuizMaster
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {user && (
          <span className="kollywood-profile">
            <span style={{ fontSize: 18, color: Theme.secondary }}>👤</span>
            {user.username}
          </span>
        )}
        <button className="kollywood-btn" onClick={() => onNav("home")}>Home</button>
        {user && <button className="kollywood-btn" onClick={onLogout}>Logout</button>}
      </div>
    </nav>
  );
}

export default Navbar;
