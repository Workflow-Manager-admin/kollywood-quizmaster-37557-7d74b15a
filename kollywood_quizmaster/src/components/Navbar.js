import React from 'react';

// PUBLIC_INTERFACE
function Navbar({ user, onLogout, onProfile, onHome }) {
  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div onClick={onHome} className="logo" style={{ cursor: "pointer" }}>
          <span className="logo-symbol" style={{ color: "#fb00ff" }}>🎬</span> Kollywood QuizMaster
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user && (
            <>
              <button className="btn" onClick={onProfile}>Profile</button>
              <button className="btn" onClick={onLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
