"use client";

import React, { useEffect, useState } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import axios from "axios";
import { moviesState } from "@/components/moviesState";
import { Movie } from "@/(types)/interface";

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
    <div className="bg-black text-white">
      <h1>{movie.title}</h1>
      <p className="text-white">{movie.overview}</p>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
        alt={movie.title}
      />
    </div>
  );
};

const DetailPageWrapper = () => (
  <RecoilRoot>
    <DetailPage />
  </RecoilRoot>
);

export default DetailPageWrapper;
