import React, { createContext, useState, useContext } from "react";

// PUBLIC_INTERFACE
const QuizContext = createContext();

// PUBLIC_INTERFACE
export function useQuiz() {
  return useContext(QuizContext);
}

// PUBLIC_INTERFACE
export function QuizProvider({ children }) {
  const [gameMode, setGameMode] = useState(null);
  const [results, setResults] = useState(null);
  const [profile, setProfile] = useState({}); // For stats, etc.

  return (
    <QuizContext.Provider value={{ gameMode, setGameMode, results, setResults, profile, setProfile }}>
      {children}
    </QuizContext.Provider>
  );
}
