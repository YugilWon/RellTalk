"use client";

import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { moviesState } from "../components/moviesState";
// import YoutubePlayer from "./youtube";
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
            // `https://api.themoviedb.org/3/movie/now_playing?language=ko&api_key=${API_KEY}&page=${page}`
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
      <h1>Popular Movies</h1>

      <ul>
        {movies.map((movie, index) => (
          <>
            <>{/* <YoutubePlayer /> */}</>
            <li key={index}>{movie.title}</li>
            <li key={index}>{movie.overview}</li>
            {/* <li key={index}>{movie.id}</li> */}

            <img
              src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
              alt="Backdrop"
            />
            <br />
            <br />
            <br />
          </>
        ))}
      </ul>
    </div>
  );
};

export default MoviePage;
