"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { SearchMovie } from "@/(types)/interface";
import Image from "next/image";
import Link from "next/link";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w92";

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<SearchMovie[]>([]);
  const [loading, setLoading] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
      if (err.name !== "AbortError") {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchMovies(keyword);
    }, 700);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [keyword, open]);

  const executeSearch = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    fetchMovies(keyword);
  };

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    setKeyword("");
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target as Node)
      ) {
        setKeyword("");
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
    }
  }, [keyword]);

  return (
    <div className="fixed top-4 right-4 z-50">
      {!open && (
        <button
          aria-label="검색 열기"
          onClick={() => setOpen(true)}
          className="p-2 rounded-full hover:bg-white/10"
        >
          <Search size={20} strokeWidth={1.8} className="text-white" />
        </button>
      )}

      {open && (
        <div
          ref={searchBoxRef}
          className="relative w-72 bg-black/80 rounded-md px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") executeSearch();
              }}
              placeholder="영화 제목 검색"
              className="flex-1 bg-transparent text-white outline-none text-sm"
            />

            <button
              aria-label="검색 실행"
              onClick={executeSearch}
              className="p-1"
            >
              <Search size={16} className="text-white" />
            </button>
          </div>

          {loading && (
            <div className="mt-2 text-xs text-white/60">검색 중...</div>
          )}

          {!loading && results.length > 0 && (
            <ul className="mt-2 max-h-80 overflow-y-auto">
              {results.slice(0, 8).map((movie) => (
                <li
                  key={movie.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-white/10 cursor-pointer"
                >
                  <Link
                    href={`/detail/${movie.id}`}
                    className="flex items-center gap-3 p-2 rounded hover:bg-white/10 transition"
                  >
                    {movie.poster_path ? (
                      <Image
                        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        width={40}
                        height={56}
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-14 bg-white/10 rounded" />
                    )}

                    <span className="text-sm text-white line-clamp-2">
                      {movie.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
