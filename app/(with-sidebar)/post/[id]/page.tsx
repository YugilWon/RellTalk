import PostDetail from "@/components/post/PostDetail";
import Comments from "@/components/comment/Comment";
import { notFound } from "next/navigation";
import { getPostById } from "@/app/lib/post";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const post = await getPostById(params.id);
  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <PostDetail post={post} />

      <Comments targetId={params.id} targetType="post" />
    </div>
  );
}
