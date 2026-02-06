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

export type CommentTargetType = "movie" | "post";

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  nickname: string;
  avatarUrl: string;
  updatedAt: string;
  targetType: CommentTargetType;
}

export type CreateCommentPayload = {
  targetId: string;
  targetType: "movie" | "post";
  content: string;
};
