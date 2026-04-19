import { Injectable } from '@angular/core';
import { baseUrl } from '../../../environments/environment.local';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  constructor(private http: HttpClient) {}

  submitOnboarding(data: any) {
    return this.http.post<any>(`${baseUrl}onboarding/submit`, data);
  }
}
