import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../../environments/environment.local';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PregnancyService {
  constructor(private http: HttpClient) {}

  createPregnancy(data: any) {
    return this.http.post<any>(`${baseUrl}pregnancy/start`, data);
  }
}
