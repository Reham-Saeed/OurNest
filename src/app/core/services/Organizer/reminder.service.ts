import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BackendReminder {
  id: string;
  title: string;
  description?: string;
  reminderDateTime: string;
  isCompleted?: boolean;
  isSent?: boolean;
  recurrencePattern?: string;
  category?: string;
  sharedWithPartner?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ReminderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5038/api/Reminders';

  getReminders(): Observable<BackendReminder[]> {
    return this.http.get<BackendReminder[]>(this.apiUrl);
  }

  addReminder(payload: Partial<BackendReminder>): Observable<BackendReminder> {
    return this.http.post<BackendReminder>(this.apiUrl, payload);
  }

  updateReminder(id: string, payload: { title: string; date: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  completeReminder(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/complete`, {});
  }

  deleteReminder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  shareReminder(id: string, body: any): Observable<BackendReminder> {
    return this.http.patch<BackendReminder>(`${this.apiUrl}/${id}/share`, body);
  }
}
