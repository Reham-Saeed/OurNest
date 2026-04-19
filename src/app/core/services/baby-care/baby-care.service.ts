import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../../environments/environment.local'; 

@Injectable({
  providedIn: 'root',
})
export class BabyCareService {
  private http = inject(HttpClient);

  getFeedingGuide(ageInMonths: number) {
    return this.http.get<any>(`${baseUrl}BabyCare/feeding?month=${ageInMonths}`);
  }

  getVitaminsGuide(ageInMonths: number) {
    return this.http.get<any>(`${baseUrl}BabyCare/vitamins?month=${ageInMonths}`);
  }

  getVaccinations(ageInMonths: number) {
    return this.http.get<any>(`${baseUrl}BabyCare/vaccinations?month=${ageInMonths}`);
  }

  getAllCareData(ageInMonths: number) {
    return this.http.get<any>(`${baseUrl}BabyCare/all?month=${ageInMonths}`);
  }
}