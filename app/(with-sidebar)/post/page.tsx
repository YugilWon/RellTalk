import { getPosts } from "@/app/lib/post";
import PostListClient from "./PostListClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { posts, totalCount } = await getPosts({ page: 1, limit: 9 });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <PostListClient
        initialPosts={posts}
        initialTotalCount={totalCount}
        initialPage={1}
        pageSize={9}
      />
    </div>
  );
}
