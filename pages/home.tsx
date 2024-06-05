"use client";

import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { moviesState } from "@/components/recoil/recoilState";
import Link from "next/link";
import { Movie } from "../(types)/interface";

const API_KEY = process.env.NEXT_PUBLIC_APIKEY;

const MoviePage = () => {
  const [movies, setMovies] = useRecoilState<Movie[]>(moviesState);

  useEffect(() => {
    const fetchMovies = async () => {
      let allMovies: Movie[] = [];

      for (let page = 1; page <= 5; page++) {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/popular?language=ko&api_key=${API_KEY}&page=${page}`
          );
          const pageMovies = response.data.results;
          allMovies = [...allMovies, ...pageMovies];
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }

      setMovies(allMovies);
    };

    fetchMovies();
  }, [setMovies]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        Popular Movies
      </h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 -z-10">
        {movies.map((movie, index) => (
          <li
            key={index}
            className="relative bg-white shadow-md rounded-lg overflow-hidden group cursor-pointer"
          >
            <Link href={`/detail/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <h2 className="text-lg font-semibold text-white text-center">
                  {movie.title}
                </h2>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoviePage;
