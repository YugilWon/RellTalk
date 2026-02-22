import { UseMutationResult } from "@tanstack/react-query";

export type Movie = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  mainTrailerId: string | null;
};

export interface Props {
  movie: Movie;
}

export type JWTPayload = {
  exp: number;
  [key: string]: any;
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
  parentId: string | null;
}

export type CreateCommentPayload = {
  targetId: string;
  targetType: "movie" | "post";
  content: string;
  parentId?: string | null;
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
  targetType: CommentTargetType;
  targetId: string;
  parentId: string;
  deleted?: boolean;
};

export interface CommentWithLike extends CommentData {
  isLiked: boolean;
  likeCount: number;
}

export type UserData = {
  id: string;
  nickname?: string;
  avatarUrl?: string;
};

export type LikeTargetType = "comment" | "movie" | "post";

export type CommentCardProps = {
  comment: CommentWithLike;
  user?: UserData;
  updateMutation: UseMutationResult<
    void,
    Error,
    UpdateCommentPayload,
    { previousComments?: any[]; queryKey: unknown[] } | undefined
  >;
  deleteMutation: UseMutationResult<void, Error, string>;
  likeMutation: UseMutationResult<
    void,
    Error,
    { targetId: string; isLiked: boolean },
    { previousData: any[] } | undefined
  >;
  createMutation: UseMutationResult<unknown, Error, CreateCommentPayload>;
};

export type ToggleLikePayload = {
  targetId: string;
  isLiked: boolean;
  targetType: LikeTargetType;
};

export interface LikeButtonProps {
  targetId: string;
  targetType: LikeTargetType;
  isLiked: boolean;
  likeCount: number;
  userId?: string;
}

export interface EditModeProps {
  comment: CommentWithLike;
  editContent: string;
  setEditContent: React.Dispatch<React.SetStateAction<string>>;
  updateMutation: UseMutationResult<void, Error, UpdateCommentPayload>;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ViewModeProps {
  comment: CommentWithLike;
  user?: UserData;
  isEdited: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setEditContent: React.Dispatch<React.SetStateAction<string>>;
  deleteMutation: UseMutationResult<void, Error, string>;
  handleLike: () => void;
  likeCount: number;
  isLiked: boolean;
  onReply: () => void;
}

export type LikeSectionProps = {
  targetId: string;
  targetType: "movie" | "post";
};

export interface CommentFormProps {
  onSubmit: (content: string) => void;
  isPending?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles:
    | {
        id: string;
        nickname: string;
        avatar_url: string;
      }
    | {
        id: string;
        nickname: string;
        avatar_url: string;
      }[];
}
