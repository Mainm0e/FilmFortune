import type { APIRoute } from 'astro';
import { fetchJson } from '../../functions/fetchJsonMWDP';
export const prerender = false;
export const GET: APIRoute = async ({ url }) => {

  const genre = url.searchParams.get("genre") || "";
  const language = url.searchParams.get("language") || "";
  const yearFrom = url.searchParams.get("yearFrom") || "";
  const yearTo = url.searchParams.get("yearTo") || "";

  // Build your TMDB API URL with those filters

  const tmdbUrl = new URL("https://api.themoviedb.org/3/discover/movie");
  tmdbUrl.searchParams.set("sort_by", "popularity.desc");

  if (genre) tmdbUrl.searchParams.set("with_genres", genre);
  if (language) tmdbUrl.searchParams.set("with_original_language", language);
  if (yearFrom) tmdbUrl.searchParams.set("primary_release_date.gte", `${yearFrom}-01-01`);
  if (yearTo) tmdbUrl.searchParams.set("primary_release_date.lte", `${yearTo}-12-31`);

  // Pick a random page to get variety
  const MAX_PAGE = 500;
  const randomPage = Math.floor(Math.random() * MAX_PAGE) + 1;
  tmdbUrl.searchParams.set("page", String(randomPage));

  const data = await fetchJson(tmdbUrl.toString());

  // Pick a random movie from results
  const movies = data.results || [];
  const randomIndex = Math.floor(Math.random() * movies.length);
  const movie = movies[randomIndex] || null;

  return new Response(JSON.stringify(movie), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
