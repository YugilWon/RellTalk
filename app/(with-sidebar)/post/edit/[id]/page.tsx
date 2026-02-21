import Write from "@/components/post/Write";
import { getPostById } from "@/app/lib/post";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function EditPage({ params }: PageProps) {
  const post = await getPostById(params.id);

  if (!post) notFound();

  return <Write post={post} />;
}
