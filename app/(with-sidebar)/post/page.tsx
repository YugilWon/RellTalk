import { getPosts } from "@/app/lib/post";
import PostList from "@/components/post/PostList";

export default async function Page() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <PostList posts={posts} />
    </div>
  );
}
