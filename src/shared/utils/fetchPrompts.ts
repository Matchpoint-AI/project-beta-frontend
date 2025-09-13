
export default async function fetchPrompts(token: string) {
  const url = `${import.meta.env.VITE_CONTENT_GEN_URL || 'https://localhost:7653'}/api/v1/app_prompts`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;
  const data = await response.json();

  data.content_generation = data.content_generation.sort(
    (a: { version: number }, b: { version: number }) => a.version - b.version
  );
  data.scrape_website = data.scrape_website.sort(
    (a: { version: number }, b: { version: number }) => a.version - b.version
  );
  return data;
}
