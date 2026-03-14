import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "필수 값이 누락되었습니다." },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { message: "인증되지 않은 사용자입니다." },
        { status: 401 },
      );
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (signInError) {
      return NextResponse.json(
        { message: "현재 비밀번호가 올바르지 않습니다." },
        { status: 401 },
      );
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "비밀번호는 최소 8자 이상이어야 합니다." },
        { status: 400 },
      );
    }

    if (updateError) {
      return NextResponse.json(
        { message: "비밀번호 변경에 실패했습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "비밀번호가 성공적으로 변경되었습니다." },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
