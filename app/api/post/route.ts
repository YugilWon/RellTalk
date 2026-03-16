import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface PostBody {
  title: string;
  content: string;
}

export async function GET(req: Request) {
  const supabase = await createClient();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "9");

  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      content,
      created_at,
      profiles (
        id,
        nickname,
        avatar_url
      )
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json(
      { error: "게시글 불러오기 실패" },
      { status: 500 },
    );
  }

  return NextResponse.json({ posts: data ?? [], totalCount: count ?? 0 });
}

export async function POST(req: Request) {
  const supabase = await createClient();

  let body: PostBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청 형식입니다." },
      { status: 400 },
    );
  }

  const { title, content } = body ?? {};

  if (typeof title !== "string" || typeof content !== "string") {
    return NextResponse.json(
      { error: "제목과 내용은 문자열이어야 합니다." },
      { status: 400 },
    );
  }

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle || !trimmedContent) {
    return NextResponse.json(
      { error: "제목과 내용은 필수입니다." },
      { status: 400 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );

  const { data: postData, error: dbError } = await supabase
    .from("posts")
    .insert({ title: trimmedTitle, content: trimmedContent, user_id: user.id })
    .select();

  if (dbError)
    return NextResponse.json({ error: "게시글 저장 실패" }, { status: 500 });

  return NextResponse.json(postData);
}
