export default function MovieListSkeleton() {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <li key={index} className="h-48 bg-gray-700 rounded-lg animate-pulse" />
      ))}
    </ul>
  );
}
