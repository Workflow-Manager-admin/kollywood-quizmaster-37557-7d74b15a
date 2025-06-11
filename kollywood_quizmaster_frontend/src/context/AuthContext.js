import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Try localStorage for session persistence
    const stored = localStorage.getItem("kq_user");
    return stored ? JSON.parse(stored) : null;
  });

  // PUBLIC_INTERFACE
  function login(username) {
    setUser({ username });
    localStorage.setItem("kq_user", JSON.stringify({ username }));
  }

  // PUBLIC_INTERFACE
  function logout() {
    setUser(null);
    localStorage.removeItem("kq_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
