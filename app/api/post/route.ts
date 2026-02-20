import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  let body;
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

  if (trimmedTitle.length > 200 || trimmedContent.length > 20000) {
    return NextResponse.json(
      { error: "제목 또는 내용이 너무 깁니다." },
      { status: 400 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title: trimmedTitle,
      content: trimmedContent,
      user_id: user.id,
    })
    .select();

  if (error) {
    return NextResponse.json({ error: "게시글 저장 실패" }, { status: 500 });
  }

  return NextResponse.json(data);
}
