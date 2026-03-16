import Link from "next/link";
import { getGenres } from "@/app/lib/movies";

export interface Genre {
  id: number;
  name: string;
}

export default async function GenresPage() {
  const data = await getGenres();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">장르별 영화</h1>

      <div className="flex flex-wrap gap-3">
        {data.genres.map((genre: Genre) => (
          <Link
            key={genre.id}
            href={`/genres/${genre.id}`}
            className="px-4 py-2 bg-gray-800 rounded-full hover:bg-indigo-600"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
