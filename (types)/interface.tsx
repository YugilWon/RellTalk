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
  createdAt: string; // created_at에서 변경됨
  userId: string; // user_id에서 변경됨
  nickname: string; // 추가됨
  avatarUrl: string; // 추가됨
}

export interface MovieComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  nickname: string;
  avatar_url: string;
}
