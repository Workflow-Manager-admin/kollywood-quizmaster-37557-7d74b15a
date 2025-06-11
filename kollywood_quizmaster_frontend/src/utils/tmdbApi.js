//
// Utility functions for The Movie DB API, using project API key.
//

const API_KEY = '5bc67d3b06aecbd18121a3cbbc16eb59';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

function buildImageUrl(path, size = 'w500') {
  return path ? `${IMG_BASE}/${size}${path}` : '';
}

// PUBLIC_INTERFACE
export async function searchMovies(query, year) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}${year ? `&year=${year}` : ''}`;
  const resp = await fetch(url);
  return resp.json();
}

// PUBLIC_INTERFACE
export async function getMovieDetails(movieId) {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
  const resp = await fetch(url);
  return resp.json();
}

// PUBLIC_INTERFACE
export async function getMovieCredits(movieId) {
  const url = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`;
  const resp = await fetch(url);
  return resp.json();
}

// PUBLIC_INTERFACE
export async function getPopularMovies(page = 1, language = 'ta-IN') {
  // Tamil movies - Kollywood
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=ta&page=${page}&sort_by=popularity.desc`;
  const resp = await fetch(url);
  return resp.json();
}

// PUBLIC_INTERFACE
export async function getPersonDetails(personId) {
  const url = `${BASE_URL}/person/${personId}?api_key=${API_KEY}`;
  const resp = await fetch(url);
  return resp.json();
}

// PUBLIC_INTERFACE
export function getPosterUrl(path, size = 'w500') {
  return buildImageUrl(path, size);
}

export default {
  searchMovies,
  getMovieDetails,
  getMovieCredits,
  getPopularMovies,
  getPersonDetails,
  getPosterUrl,
};
