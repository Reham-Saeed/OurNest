import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommunityService } from '../../core/services/community/community.service';
import {
  IPost,
  IComment,
  ICreateComment,
  ICreatePost,
  ICreateReply,
  IReply,
} from '../../core/interfaces/community';
import { TimeAgoPipe } from '../../core/pipes/time-ago.pipe';
import { SearchPipe } from '../../core/pipes/search.pipe';

@Component({
  selector: 'app-mothers-community',
  imports: [CommonModule, FormsModule, TimeAgoPipe, SearchPipe],
  templateUrl: './mothers-community.component.html',
  styleUrl: './mothers-community.component.scss',
})
export class MothersCommunityComponent {
  posts: IPost[] = [];
  newPostContent: string = '';
  newCommentContent: { [postId: string]: string } = {};
  newReplyContent: { [commentId: string]: string } = {};
  comments: { [postId: string]: IComment[] } = {};
  replies: { [commentId: string]: IReply[] } = {};
  commentsVisible: { [postId: string]: boolean } = {};
  repliesVisible: { [commentId: string]: boolean } = {};
  searchTitle: string = '';
  hasText = false;

  constructor(private _CommunityService: CommunityService) {}

  onInputChange() {
    this.hasText = this.newPostContent.trim().length > 0;
  }
  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this._CommunityService.getPosts().subscribe((posts) => {
      this.posts = posts;
    });
  }

  addPost(): void {
    if (!this.newPostContent.trim()) return;
    const post: ICreatePost = {
      content: this.newPostContent,
      category: 'Pregnancy',
    };
    this._CommunityService.createPost(post).subscribe((newPost) => {
      this.posts.unshift(newPost);
      this.newPostContent = '';
    });
  }

  loadComments(postId: string): void {
    this._CommunityService.getComments(postId).subscribe((comments) => {
      this.comments[postId] = comments;
      comments.forEach((c) => this.loadReplies(c.id));
    });
  }

  toggleComments(postId: string) {
    this.commentsVisible[postId] = !this.commentsVisible[postId];
    if (this.commentsVisible[postId] && !this.comments[postId]) {
      this.loadComments(postId);
    }
  }

  startReply(commentId: string) {
    this.repliesVisible[commentId] = !this.repliesVisible[commentId];
    if (this.repliesVisible[commentId] && !this.replies[commentId]) {
      this.loadReplies(commentId);
    }
  }

  addComment(postId: string): void {
    const content = this.newCommentContent[postId];
    if (!content?.trim()) return;

    const comment: ICreateComment = { content };
    this._CommunityService.createComment(postId, comment).subscribe((newComment) => {
      if (!this.comments[postId]) this.comments[postId] = [];
      this.comments[postId].push(newComment);
      this.newCommentContent[postId] = '';
    });
  }

  loadReplies(commentId: string): void {
    this._CommunityService.getReplies(commentId).subscribe((replies) => {
      this.replies[commentId] = replies;
    });
  }

  addReply(commentId: string): void {
    const content = this.newReplyContent[commentId];
    if (!content?.trim()) return;

    const reply: ICreateReply = { content };
    this._CommunityService.createReply(commentId, reply).subscribe((newReply) => {
      if (!this.replies[commentId]) this.replies[commentId] = [];
      this.replies[commentId].push(newReply);
      this.newReplyContent[commentId] = '';
    });
  }

  addLike(post: IPost): void {
    this._CommunityService.addLike(post.id).subscribe((res) => {
      post.isLikedByCurrentUser = res.liked;
      if (res.liked) {
        post.likesCount++;
      } else {
        post.likesCount--;
      }
    });
  }
}
