import PostDetail from "@/components/post/PostDetail";
import { getPostById } from "@/app/lib/post";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const post = await getPostById(params.id);
  if (!post) return null;

  return <PostDetail post={post} />;
}
