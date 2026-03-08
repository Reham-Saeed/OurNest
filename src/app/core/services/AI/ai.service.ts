import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../../environments/environment.local';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  constructor(private http: HttpClient) {}

  analyzeImage(file: File, modelType: string) {
    const formData = new FormData();

    formData.append('image', file);
    formData.append('modelType', modelType);

    return this.http.post(`${baseUrl}AI/inference`, formData);
  }
}
