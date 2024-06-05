export type Movie = {
  id?: string;
  title: string;
  overview: string;
  backdrop_path: string;
};

export type JWTPayload = {
  exp: number;
  [key: string]: any;
};
