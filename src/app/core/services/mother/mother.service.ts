import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../../environments/environment.local';

@Injectable({
  providedIn: 'root',
})
export class MotherService {
  constructor(private http: HttpClient) {}

  createMother(data: any) {
    return this.http.post<any>(`${baseUrl}mother`, data);
  }

  getMotherdashboard() {
    return this.http.get<any>(`${baseUrl}mother/dashboard`);
  }
}
