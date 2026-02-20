import PostDetail from "@/components/post/PostDetail";
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

  return <PostDetail post={post} />;
}
