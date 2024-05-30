import { atom } from "recoil";
import { Movie } from "@/(types)/interface";

export const moviesState = atom<Movie[]>({
  key: "moviesState",
  default: [],
});

export const isLoggedInState = atom({
  key: "isLoggedInState",
  default: false,
});

export const tokenState = atom({
  key: "tokenState",
  default: null,
});

export const tokenExpiryAlertState = atom({
  key: "tokenExpiryAlertState",
  default: false,
});
