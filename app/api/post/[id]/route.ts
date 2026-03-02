import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type UpdatePostBody = {
  title?: string;
  content?: string;
};

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();
  const postId = params.id;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: "삭제 실패" }, { status: 500 });

  return NextResponse.json({ message: "삭제 성공" });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();
  const postId = params.id;

  let body: UpdatePostBody;
  try {
    body = (await req.json()) as UpdatePostBody;
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청 형식입니다." },
      { status: 400 },
    );
  }

  const { title, content } = body ?? {};

  if (
    (title && typeof title !== "string") ||
    (content && typeof content !== "string")
  ) {
    return NextResponse.json(
      { error: "제목과 내용은 문자열이어야 합니다." },
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

  const updateData: Partial<UpdatePostBody> = {};
  if (title) updateData.title = title.trim();
  if (content) updateData.content = content.trim();

  const { error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: "수정 실패" }, { status: 500 });

  return NextResponse.json({ message: "수정 성공" });
}
