import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const TMDB_API_TOKEN = import.meta.env.PUBLIC_TMDB_API_TOKEN;
  const MAX_PAGE = 500;

  const fetchJson = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TMDB_API_TOKEN}`,
        accept: 'application/json',
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    return res.json();
  };

  try {
    const firstPage = await fetchJson(`https://api.themoviedb.org/3/movie/popular`);
    const totalPages = Math.min(firstPage.total_pages || 1, MAX_PAGE);
    const randomPage = Math.floor(Math.random() * totalPages) + 1;
    const pageData = await fetchJson(`https://api.themoviedb.org/3/movie/popular?page=${randomPage}`);
    const movies = pageData.results || [];
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    return new Response(JSON.stringify(randomMovie), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to get movie' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
