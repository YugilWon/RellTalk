import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();

  const { title, content } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "제목과 내용은 필수입니다." },
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
      title,
      content,
      user_id: user.id,
    })
    .select();

  if (error) {
    return NextResponse.json({ error: "게시글 저장 실패" }, { status: 500 });
  }

  return NextResponse.json(data);
}
