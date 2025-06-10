//
// TMDB utility API functions for Kollywood QuizMaster
//
// Uses API KEY: 5bc67d3b06aecbd18121a3cbbc16eb59
// All fetches Kollywood (Tamil, region=IN) movies, biasing toward moderately obscure/non-mainstream (lower popularity)
//

const API_KEY = "5bc67d3b06aecbd18121a3cbbc16eb59";
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Core fetch utility for TMDB API
 * Use for GET requests
 */
async function tmdbFetch(endpoint, params = {}) {
  params.api_key = API_KEY;
  params.language = "ta";
  params.region = "IN";

  // Remove undefined/null params
  const searchParams = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
  );
  const url = `${BASE_URL}${endpoint}?${searchParams.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB fetch failed [${res.status}]: ${url}`);
  }
  return await res.json();
}

/**
 * Get "hard to guess" Kollywood movies
 * (less popular, but minimum 3 votes so not empty entries, randomize page)
 *
 * @param {number} [minVote=3] - minimum votes to avoid junk/unreleased
 * @param {number} [maxPopularity=7] - maximum popularity to avoid blockbusters
 * @param {number} [page] - random page
 * @returns {Promise<Array>} - Array of movie objects
 */
// PUBLIC_INTERFACE
export async function fetchObscureTamilMovies({minVote=3, maxPopularity=7, perPage=10, page=null, year, withCast, withGenres, sortByRandom=true}={}) {
  // Use 'discover' endpoint to combine filters
  // See: https://developers.themoviedb.org/3/discover/movie-discover
  let query = {
    with_original_language: "ta",
    "vote_count.gte": minVote,
    "popularity.lte": maxPopularity,
    page: page || Math.floor(Math.random() * 10 + 1),
    sort_by: (sortByRandom ? "vote_average.asc" : "popularity.asc"), // for less popular/less acclaimed
    include_adult: false,
    with_cast: withCast,
    with_genres: withGenres,
    primary_release_year: year
  };

  if (!query.with_cast) delete query.with_cast; // don't pass empty as string/param
  if (!query.with_genres) delete query.with_genres;
  if (!query.primary_release_year) delete query.primary_release_year;

  let data = await tmdbFetch("/discover/movie", query);
  // fallback: try another random page if list is too short
  if (data.results.length < (perPage || 10)) {
    data = await tmdbFetch("/discover/movie", {...query, page: Math.floor(Math.random() * 20 + 1)});
  }
  return data.results.slice(0, perPage || 10);
}

// PUBLIC_INTERFACE
export async function fetchMovieDetails(movieId) {
  return await tmdbFetch(`/movie/${movieId}`, { append_to_response: "credits,images" });
}

// PUBLIC_INTERFACE
export async function fetchMovieCast(movieId) {
  const detail = await tmdbFetch(`/movie/${movieId}/credits`);
  return detail.cast || [];
}

// PUBLIC_INTERFACE
export async function fetchActorDetails(actorId) {
  return await tmdbFetch(`/person/${actorId}`);
}

// PUBLIC_INTERFACE
export async function fetchActorCredits(actorId) {
  // Get all movies for a given person (for reverse search)
  const res = await tmdbFetch(`/person/${actorId}/movie_credits`);
  return res.cast || [];
}

// PUBLIC_INTERFACE
export async function fetchMovieImages(movieId) {
  const res = await tmdbFetch(`/movie/${movieId}/images`);
  return res.posters || [];
}

// PUBLIC_INTERFACE
export async function fetchGenres() {
  const res = await tmdbFetch("/genre/movie/list");
  return res.genres;
}
