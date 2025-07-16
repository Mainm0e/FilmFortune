import type { APIRoute } from 'astro';
import { fetchJson } from '../../functions/fetchJsonMWDP';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const genre = url.searchParams.get("genre") || "";
  const language = url.searchParams.get("language") || "";
  const yearFrom = url.searchParams.get("yearFrom") || "";
  const yearTo = url.searchParams.get("yearTo") || "";
  const rating = url.searchParams.get("rating") || "";
  const country = url.searchParams.get("country") || "US";
  const services = url.searchParams.getAll("service");

  const tmdbUrl = new URL("https://api.themoviedb.org/3/discover/movie");
  tmdbUrl.searchParams.set("sort_by", "popularity.desc");

  if (genre) tmdbUrl.searchParams.set("with_genres", genre);
  if (language) tmdbUrl.searchParams.set("with_original_language", language);
  if (yearFrom) tmdbUrl.searchParams.set("primary_release_date.gte", `${yearFrom}-01-01`);
  if (yearTo) tmdbUrl.searchParams.set("primary_release_date.lte", `${yearTo}-12-31`);
  if (rating) {
    let certCountry = "US";
    if (["K-7", "K-12", "K-16", "K-18"].includes(rating)) certCountry = "FI";
    else if (["12", "15", "18", "U"].includes(rating)) certCountry = "GB";
    else certCountry = "US";

    const certValue = rating.startsWith("K-") ? rating.slice(2) : rating;
    tmdbUrl.searchParams.set("certification_country", certCountry);
    tmdbUrl.searchParams.set("certification", certValue);
  }

  const MAX_PAGE = 500;
  const randomPage = Math.floor(Math.random() * MAX_PAGE) + 1;
  tmdbUrl.searchParams.set("page", String(randomPage));

  const data = await fetchJson(tmdbUrl.toString());
  const movies = data.results || [];

  let selectedMovie = null;

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[Math.floor(Math.random() * movies.length)];

    if (services.length === 0) {
      selectedMovie = movie;
      break;
    }

    const provUrl = `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers`;
    const provData = await fetchJson(provUrl);

    const matchProviders = provData.results?.[country]?.flatrate || [];
    const countryProviders = matchProviders.map(p => p.provider_name);

    const match = services.some(service => countryProviders.includes(service));
    if (match) {
      selectedMovie = {
        ...movie,
        providers: matchProviders.map(p => ({
          name: p.provider_name,
          logo: `https://image.tmdb.org/t/p/w45${p.logo_path}`
        }))
      };
      break;
    }
  }

  return new Response(JSON.stringify(selectedMovie), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
