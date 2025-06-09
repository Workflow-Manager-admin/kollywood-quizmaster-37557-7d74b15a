import React, { createContext, useContext, useState, useCallback } from "react";

// PUBLIC_INTERFACE
/**
 * Provides a context for a session-wide, unique-movie pool for quiz games.
 * Shuffle and claim movies per round, ensuring no repeats within a round.
 */

const MovieSessionContext = createContext();

/**
 * Utility to shuffle an array
 */
function shuffle(array) {
  // Using Fisher-Yates algorithm
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// PUBLIC_INTERFACE
/**
 * MovieSessionProvider
 * @param {Object} props - { movies: full movie list, children }
 * Provides: [sessionMoviePool, claimMoviesForRound, resetSession]
 */
export function MovieSessionProvider({ movies, children }) {
  // Movies remaining for this round (no repeats within round)
  const [unusedMovies, setUnusedMovies] = useState([]);
  // Movies claimed for current round
  const [claimed, setClaimed] = useState([]);
  // Was this session initialized?
  const [initialized, setInitialized] = useState(false);

  // Prepare session: shuffle movies for new round (call at start of each round)
  const initializeSession = useCallback(() => {
    const shuffled = shuffle(movies);
    setUnusedMovies(shuffled);
    setClaimed([]);
    setInitialized(true);
  }, [movies]);

  // Claim N unique movies from pool for this round (removes them from pool)
  // Returns null if not enough movies left
  const claimMoviesForRound = useCallback((n) => {
    if (unusedMovies.length < n) return null;
    const roundMovies = unusedMovies.slice(0, n);
    setUnusedMovies(unusedMovies.slice(n));
    setClaimed([...claimed, ...roundMovies.map(m => m.id)]);
    return roundMovies;
  }, [unusedMovies, claimed]);

  // For modes that want a single next unique movie on demand
  const claimNextMovie = useCallback(() => {
    if (unusedMovies.length === 0) return null;
    const [nextMovie, ...rest] = unusedMovies;
    setUnusedMovies(rest);
    setClaimed([...claimed, nextMovie.id]);
    return nextMovie;
  }, [unusedMovies, claimed]);

  // To reset the pool for a new play session
  const resetSession = useCallback(() => {
    setUnusedMovies([]);
    setClaimed([]);
    setInitialized(false);
  }, []);

  // Find if a movie has already been claimed this session
  const wasMovieClaimed = useCallback((movieId) => claimed.includes(movieId), [claimed]);

  return (
    <MovieSessionContext.Provider
      value={{
        sessionInitialized: initialized,
        initializeSession,
        claimMoviesForRound,
        claimNextMovie,
        resetSession,
        wasMovieClaimed,
        remainingCount: unusedMovies.length,
        claimedIds: claimed,
      }}
    >
      {children}
    </MovieSessionContext.Provider>
  );
}

// PUBLIC_INTERFACE
/**
 * useMovieSession - consumption hook for session-wide movie pool.
 */
export function useMovieSession() {
  return useContext(MovieSessionContext);
}
