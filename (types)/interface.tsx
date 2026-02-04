export type Movie = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
};

export type JWTPayload = {
  exp: number;
  [key: string]: any;
};

export type SearchMovie = {
  id: number;
  title: string;
  poster_path: string | null;
};

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export interface DetailPageProps {
  params: { id: string };
}
