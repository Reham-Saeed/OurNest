import { Injectable } from '@angular/core';
import { baseUrl } from '../../../environments/environment.local';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BabyService {
  constructor(private http: HttpClient) {}

  getAllBabies() {
    return this.http.get<any[]>(`${baseUrl}baby`);
  }

  createBaby(data: any) {
    return this.http.post(`${baseUrl}baby`, data);
  }

  deleteBaby(id: string) {
    return this.http.delete(`${baseUrl}baby/${id}`);
  }
}
