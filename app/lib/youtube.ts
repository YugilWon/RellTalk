export async function getYoutubeTrailerId(
  title: string,
): Promise<string | null> {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  if (!YOUTUBE_API_KEY) return null;

  const searchQuery = `${title} official trailer`;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    searchQuery,
  )}&key=${YOUTUBE_API_KEY}&maxResults=1&type=video`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 604800 },
    });
    if (!response.ok) {
      console.error("YouTube API 요청 실패:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data.items?.[0]?.id?.videoId ?? null;
  } catch (e) {
    console.error("YouTube API 요청 중 오류 발생:", e);
    return null;
  }
}
