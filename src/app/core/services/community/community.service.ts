import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../../environments/environment.local';
import { Observable } from 'rxjs';
import { IPost, ICreatePost, IReport, IComment, ICreateComment, IReply, ICreateReply } from '../../interfaces/community';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {

  constructor(private http: HttpClient) {}

  getPosts(): Observable<IPost[]> {
    return this.http.get<IPost[]>(`${baseUrl}community/posts`);
  }

  createPost(post: ICreatePost): Observable<IPost> {
    return this.http.post<IPost>(`${baseUrl}community/posts`, post);
  }

  addLike(postId: string): Observable<any> {
    return this.http.post<any>(`${baseUrl}community/posts/${postId}/like`, {});
  }

  getComments(postId: string): Observable<IComment[]> {
    return this.http.get<IComment[]>(`${baseUrl}community/posts/${postId}/comments`);
  }

  createComment(postId: string, comment: ICreateComment): Observable<IComment> {
    return this.http.post<IComment>(`${baseUrl}community/posts/${postId}/comments`, comment);
  }

  getReplies(commentId: string): Observable<IReply[]> {
    return this.http.get<IReply[]>(`${baseUrl}community/comments/${commentId}/replies`);
  }

  createReply(commentId: string, reply: ICreateReply): Observable<IReply> {
    return this.http.post<IReply>(`${baseUrl}community/comments/${commentId}/replies`, reply);
  }
}
