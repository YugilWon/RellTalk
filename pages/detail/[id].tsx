"use client";
import "../../app/globals.css";
import React, { useEffect, useState } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import axios from "axios";
import { moviesState } from "@/components/recoil/moviesState";
import { Movie } from "@/(types)/interface";
import HomeLink from "@/components/homeLink";

const DetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const movies = useRecoilValue(moviesState);
  const [movie, setMovie] = useState<Movie>();

  useEffect(() => {
    const foundMovie = movies.find((item) => String(item.id) === id);
    if (foundMovie) {
      setMovie(foundMovie);
    } else {
      const fetchMovie = async () => {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_APIKEY}&language=ko`
          );
          setMovie(response.data);
        } catch (error) {
          console.error("Error fetching movie:", error);
        }
      };

      fetchMovie();
    }
  }, [id, movies]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HomeLink />

      <div className="p-4 max-w-screen-lg mx-auto w-600 h-400 bg bg-blend-color mt-60 bg-gray-400">
        <div className="flex justify-center items-center">
          <img
            className="w-1/3 mr-4"
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
            alt={movie.title}
          />
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            <p className="text-white">{movie.overview}</p>
          </div>
        </div>
      </div>
    </>
  );
};

const DetailPageWrapper = () => (
  <RecoilRoot>
    <DetailPage />
  </RecoilRoot>
);

export default DetailPageWrapper;
