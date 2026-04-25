import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  priority?: number;
  category?: string;
  isEditing?: boolean;
  sharedWithPartner?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5038/api/Todo';

  getTodos(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  addTodo(payload: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, payload);
  }

  toggleComplete(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/toggle`, {});
  }

  updateTodo(id: string, payload: { task: string; isDone: boolean }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  deleteTodo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  shareTodo(id: string,body:any): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/share`,body);
  }
}
