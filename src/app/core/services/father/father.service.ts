import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../../environments/environment.local';

@Injectable({
  providedIn: 'root',
})
export class FatherService {
    constructor(private http: HttpClient) {}

  createFather(data: any) {
    return this.http.post<any>(`${baseUrl}father`, data);
  }

  getFatherdashboard() {
    return this.http.get<any>(`${baseUrl}father/dashboard`);
  }
}
