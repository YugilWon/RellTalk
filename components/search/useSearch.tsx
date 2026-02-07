import { useState, useEffect, useRef } from "react";
import { SearchMovie } from "@/(types)/interface";

export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w92";

export const useSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<SearchMovie[]>([]);
  const [loading, setLoading] = useState(false);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const fetchMovies = async (query: string) => {
    if (!query.trim()) return;

    abortController.current?.abort();
    abortController.current = new AbortController();

    try {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: abortController.current.signal,
      });

      if (!res.ok) throw new Error("검색 실패");

      const data = await res.json();
      setResults(data.results || []);
    } catch (err: any) {
      if (err.name !== "AbortError") console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchMovies(keyword), 700);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [keyword]);

  const executeSearch = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    fetchMovies(keyword);
  };

  return { keyword, setKeyword, results, loading, executeSearch };
};
