//
// Utility for TheMovieDB API (TMDb) requests specific to Kollywood (Tamil) movies
//

const API_KEY = "5bc67d3b06aecbd18121a3cbbc16eb59";
const BASE_URL = "https://api.themoviedb.org/3";
const TAMIL_LANGUAGE_CODE = "ta";

// PUBLIC_INTERFACE
/**
 * Fetches Kollywood (Tamil) movies from TheMovieDB, providing only moderately difficult titles.
 * - Returns only Tamil-language movies
 * - Requires at least 20 votes (avoid obscure)
 * - Excludes most popular 30% (blockbusters) and least popular 30% (unknowns)
 * - Returns a shuffled moderate-difficulty list, suitable for quiz games
 * @returns {Promise<{results: Array}>} Array of movie objects
 */
export async function fetchKollywoodMovies() {
  // Fetch several pages by popularity to get enough for filtering
  const results = [];
  const moviesPerPage = 20;
  const pagesToFetch = 3;

  for (let page = 1; page <= pagesToFetch; page++) {
    const url = `${BASE_URL}/discover/movie`
      + `?api_key=${API_KEY}`
      + `&with_original_language=${TAMIL_LANGUAGE_CODE}`
      + `&sort_by=popularity.desc`
      + `&vote_count.gte=20`
      + `&page=${page}`;
    // eslint-disable-next-line no-await-in-loop
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch Kollywood movies from TheMovieDB API.");
    }
    const data = await response.json();
    results.push(...(Array.isArray(data.results) ? data.results : []));
  }

  // De-duplicate by TMDb movie id
  const deduped = [];
  const seen = new Set();
  for (const m of results) {
    if (!seen.has(m.id)) {
      deduped.push(m);
      seen.add(m.id);
    }
  }

  // Sort descending by popularity and select moderate block (30-70 percentile)
  const sorted = deduped.sort((a, b) => b.popularity - a.popularity);
  const total = sorted.length;
  const lower = Math.floor(total * 0.3);
  const upper = Math.ceil(total * 0.7);
  let moderate = sorted.slice(lower, upper);

  // Fallback: if for any reason too few are available, relax slice and use all with >=20 votes
  if (moderate.length < 12) {
    moderate = sorted.filter(m => m.vote_count >= 20);
  }

  // Shuffle to avoid boring order
  moderate = shuffle(moderate);

  return { results: moderate };
}

// PUBLIC_INTERFACE
/**
 * Shuffle an array using Fisher-Yates.
 * @param {Array} arr
 * @returns {Array}
 */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
