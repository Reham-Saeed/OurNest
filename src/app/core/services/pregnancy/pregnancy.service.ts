import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../../environments/environment.local';


@Injectable({
  providedIn: 'root',
})
export class PregnancyService {
  constructor(private http: HttpClient) {}

  startPregnancy(data: any) {
    return this.http.post<any>(`${baseUrl}pregnancy/start`, data);
  }
  endPregnancy() {
    return this.http.post<any>(`${baseUrl}pregnancy/end`,{});
  }
}
