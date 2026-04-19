import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseUrl } from '../../../environments/environment.local';
import { Conversation, Message } from '../../interfaces/chatbot';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  constructor(private http: HttpClient) {}

  private refreshConversationsSubject = new BehaviorSubject<boolean>(false);
  refreshConversations$ = this.refreshConversationsSubject.asObservable();

  notifyConversationsChanged() {
    this.refreshConversationsSubject.next(true);
  }

  analyzeFood(file: File) {
    const formData = new FormData();

    formData.append('image', file);

    return this.http.post(`${baseUrl}ai/food/analyze`, formData);
  }
  analyzeSkin(file: File) {
    const formData = new FormData();

    formData.append('image', file);

    return this.http.post(`${baseUrl}ai/skin/analyze`, formData);
  }
  analyzeMedicine(file: File) {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post(`http://127.0.0.1:8000/predict`, formData);
  }

  createConversation(userId: string, title: string): Observable<Conversation> {
    return this.http.post<Conversation>(`${baseUrl}ai/conversations`, {
      userId,
      title,
    });
  }

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${baseUrl}ai/conversations`);
  }

  sendMessage(conversationId: string, content: string): Observable<Message> {
    return this.http.post<Message>(`${baseUrl}ai/messages`, {
      conversationId,
      content,
    });
  }

  getMessages(conversationId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${baseUrl}ai/messages/${conversationId}`);
  }
}
