import React from "react";
import { useAuth } from "../context/AuthContext";
// Optionally, use quiz stats from QuizContext

function Profile() {
  const { user } = useAuth();
  // For now, display only username and mock stats
  return (
    <div style={{ maxWidth: 400, margin: "40px auto", background: "#fff", borderRadius: 14, boxShadow: "0 6px 36px #b987ff44", padding: "36px 28px" }}>
      <div className="kollywood-game-header" style={{ textAlign: "center" }}>Profile</div>
      <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 13, textAlign: "center" }}>
        {user.username}
      </div>
      <div style={{ fontSize: 16, color: "#a246ff", marginBottom: 11 }}>Kollywood Fanatic</div>
      <div>
        <b>Total Games Played:</b> <span>—</span>
        <br />
        <b>Best Score:</b> <span>—</span>
        <br />
        <b>Favorite Game:</b> <span>—</span>
      </div>
    </div>
  );
}

export default Profile;
