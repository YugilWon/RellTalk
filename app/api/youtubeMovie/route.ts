import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");

  if (!title) {
    return NextResponse.json(
      { error: "영화 제목이 필요합니다." },
      { status: 400 }
    );
  }

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: "YouTube API Key가 없습니다." },
      { status: 500 }
    );
  }

  const searchQuery = `${title} official trailer`;

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    searchQuery
  )}&key=${YOUTUBE_API_KEY}&maxResults=1&type=video`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "예고편을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const videoId = data.items[0].id.videoId;

    return NextResponse.json({ videoId });
  } catch (error) {
    console.error("YouTube API 요청 실패:", error);

    return NextResponse.json(
      { error: "YouTube API 요청 실패" },
      { status: 500 }
    );
  }
}
