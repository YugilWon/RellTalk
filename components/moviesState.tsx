import { atom } from "recoil";
import { Movie } from "@/(types)/interface";

export const moviesState = atom<Movie[]>({
  key: "moviesState",
  default: [],
});
