import type { APIRoute } from 'astro';
export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  // ✅ Correct way
  console.log('URL:', url);
  const genre = url.searchParams.get('genre');
  const language = url.searchParams.get('language');
  const yearFrom = url.searchParams.get('yearFrom');
  const yearTo = url.searchParams.get('yearTo');

  console.log('Genre:', genre);
  console.log('Language:', language);
  console.log('Year From:', yearFrom);
  console.log('Year To:', yearTo);

  return new Response(
    JSON.stringify({
      message: "Random movie fetched!",
      genre,
      language,
      yearFrom,
      yearTo
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
};