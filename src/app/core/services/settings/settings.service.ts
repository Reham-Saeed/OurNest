import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../../environments/environment.local';

export interface UserProfile {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  profilePictureUrl?: string;
  bio: string;
  country: string;
  city: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {

  private http = inject(HttpClient);
  private apiUrl = `${baseUrl}Users`;

  uploadImage(file: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile/picture`, file);
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
  }

  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/profile`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/change-password`, data);
  }
}
