import { supabase } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Editor } from "@tiptap/react";

export const addImage = async (file: File, editor: Editor) => {
  const fileExt = file.name.split(".").pop() || "png";
  const fileName = `${uuidv4()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("post-images")
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from("post-images").getPublicUrl(fileName);

  editor.chain().focus().setImage({ src: data.publicUrl }).run();
};

export const handleSubmit = async (
  title: string,
  editor: Editor,
  setIsSubmitting: (value: boolean) => void,
  router: any,
  postId?: string,
) => {
  if (!editor || !title.trim()) return;

  const htmlContent = editor.getHTML();
  if (!htmlContent.trim()) {
    alert("내용을 입력해주세요.");
    return;
  }

  setIsSubmitting(true);

  try {
    const res = await fetch(postId ? `/api/post/${postId}` : "/api/post", {
      method: postId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), content: htmlContent }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      alert(`저장 실패: ${errorData.error ?? res.statusText}`);
      return;
    }

    const data = await res.json();
    const newId = postId ?? data[0]?.id;

    if (newId) {
      alert(postId ? "수정 완료" : "저장 완료");
      router.push(`/post/${newId}`);
      router.refresh();
    } else {
      alert("저장 후 ID를 가져오지 못했습니다.");
    }
  } catch (err) {
    console.error("게시글 저장 중 오류:", err);
    alert("게시글 저장 중 오류가 발생했습니다.");
  } finally {
    setIsSubmitting(false);
  }
};
