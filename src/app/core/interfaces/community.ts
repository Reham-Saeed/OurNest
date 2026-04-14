export interface IPost {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  imageUrl?: string | null;
  category: string;
  likesCount: number;
  commentsCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string;
}

export interface IComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  repliesCount: number;
  createdAt: string;
}

export interface IReply {
  id: string;
  commentId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface ICreatePost {
  content: string;
  imageUrl?: string;
  category: string;
}

export interface ICreateComment {
  content: string;
}

export interface ICreateReply {
  content: string;
}

export interface IReport {
  reason: string;
  additionalNotes?: string;
}