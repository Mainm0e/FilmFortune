const TMDB_API_TOKEN = import.meta.env.PUBLIC_TMDB_API_TOKEN;


export async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_API_TOKEN}`,
      accept: 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

