import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: string;
  email: string;
  role: string;
  emailConfirmed: boolean;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  error: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5038/api/Auth';

  private _HttpClient = inject(HttpClient);

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this._HttpClient
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap((res) => this.handleAuthResponse(res)));
  }

  register(data: {
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }): Observable<AuthResponse> {
    return this._HttpClient.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => this.handleAuthResponse(res)), // Auto-login after register
    );
  }

  refreshSession(): Observable<AuthResponse> {
    const payload = {
      token: this.getAccessToken(),
      refreshToken: this.getRefreshToken(),
    };
    return this._HttpClient.post<AuthResponse>(`${this.apiUrl}/refresh`, payload).pipe(
      tap((res) => this.handleAuthResponse(res)), // Update tokens with the new ones
    );
  }

  loginWithGoogle(data: { token: string; role: string }): Observable<AuthResponse> {
    return this._HttpClient
      .post<AuthResponse>(`${this.apiUrl}/google`, data)
      .pipe(tap((res) => this.handleAuthResponse(res)));
  }

  loginWithFacebook(data: { token: string; role: string }): Observable<AuthResponse> {
    return this._HttpClient
      .post<AuthResponse>(`${this.apiUrl}/facebook`, data)
      .pipe(tap((res) => this.handleAuthResponse(res)));
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (response.success && response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('refresh_token', response.refreshToken);
      localStorage.setItem('current_user', JSON.stringify(response.user));
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  getUser(): User | null {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
  
  logout(): Observable<any> {
    return this._HttpClient.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('current_user');
      }),
    );
  }
}
