import { UseMutationResult } from "@tanstack/react-query";

export type Movie = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
};

export interface Props {
  movie: Movie;
}

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

export type UpdateCommentPayload = {
  id: string;
  content: string;
};

export type CommentData = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  nickname?: string;
  avatarUrl?: string;
};

export type UserData = {
  id: string;
  nickname?: string;
  avatarUrl?: string;
};

export type CommentCardProps = {
  comment: CommentData;
  user?: UserData;
  updateMutation: UseMutationResult<
    unknown,
    unknown,
    UpdateCommentPayload,
    unknown
  >;
  deleteMutation: UseMutationResult<unknown, unknown, string, unknown>;
};
