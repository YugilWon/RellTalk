import { atom } from "recoil";
import { Movie } from "@/(types)/interface";

export const moviesState = atom<Movie[]>({
  key: "moviesState",
  default: [],
});

export const isLoggedInState = atom<boolean>({
  key: "isLoggedInState",
  default: false,
});

// export const tokenState = atom<string | null>({
//   key: "tokenState",
//   default: null,
// });

// export const tokenExpiryAlertState = atom({
//   key: "tokenExpiryAlertState",
//   default: false,
// });

export const isHoveredState = atom({
  key: "isHoveredState",
  default: false,
});
