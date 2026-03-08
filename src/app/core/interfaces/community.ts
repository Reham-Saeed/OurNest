export interface IPost {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  likedByUser: boolean;
  createdAt: string;
}

export interface IComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  replies: number;
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
  image?: string;
}

export interface ICreateComment {
  content: string;
}

export interface ICreateReply {
  content: string;
}

export interface IReport {
  reason: string;
  notes?: string;
}