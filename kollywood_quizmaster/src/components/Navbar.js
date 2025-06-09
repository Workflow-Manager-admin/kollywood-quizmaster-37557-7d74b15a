import React from "react";
import './Navbar.css';

// PUBLIC_INTERFACE
/**
 * App navbar, themed for Kollywood QuizMaster.
 * Shows user info & logout if logged in.
 * @param {{user?:Object, onLogout?: Function}} props
 */
function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar kollywood-navbar">
      <div className="navbar-content container">
        <div className="navbar-logo big-logo-text">
          <span className="logo-symbol">*</span>
          Kollywood <span style={{ color:"var(--secondary)", fontWeight:600 }}>QuizMaster</span>
        </div>
        <div className="navbar-menu">
          {user ? (
            <>
              <span className="navbar-user">🎬 Hi, {user.username}</span>
              <button className="btn btn-outline" onClick={onLogout}>Logout</button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
