//
// Utility for TheMovieDB API (TMDb) requests specific to Kollywood (Tamil) movies
//

const API_KEY = "5bc67d3b06aecbd18121a3cbbc16eb59";
const BASE_URL = "https://api.themoviedb.org/3";
const TAMIL_LANGUAGE_CODE = "ta-IN"; // Tamil - India

// PUBLIC_INTERFACE
/**
 * Fetches Kollywood (Tamil) movies from TheMovieDB.
 * By default, returns a list of popular Tamil movies.
 * @returns {Promise<Object>} JSON response from TMDb API.
 */
export async function fetchKollywoodMovies() {
  // "with_original_language=ta" gives movies in Tamil, sorted by popularity
  const url =
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=ta&sort_by=popularity.desc`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch Kollywood movies from TheMovieDB API.");
  }
  return response.json();
}

// Additional utility functions for future use can be added here
