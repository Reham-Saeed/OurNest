import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../../environments/environment.local';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {

  constructor(private http: HttpClient) { }

  uploadImage(file: FormData): Observable<any> {
    return this.http.put<any>(`${baseUrl}users/profile/picture`, file);
  }
}
