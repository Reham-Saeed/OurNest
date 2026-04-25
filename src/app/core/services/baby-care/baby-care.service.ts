import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../../environments/environment.local'; 

@Injectable({
  providedIn: 'root',
})
export class BabyCareService {
  private http = inject(HttpClient);

  getFeedingGuide(ageInMonths: number) {
    return this.http.get<any>(`${baseUrl}BabyCare/feeding?age=${ageInMonths}`);
  }

  getVitaminsGuide(ageInMonths: number) {
    return this.http.get<any>(`${baseUrl}BabyCare/vitamins?age=${ageInMonths}`);
  }

  getVaccinations(ageInMonths: number) {
    return this.http.get<any>(`${baseUrl}BabyCare/vaccinations?age=${ageInMonths}`);
  }

  getAllCareData(ageInMonths: number) {
    return this.http.get<any>(`${baseUrl}BabyCare/all?age=${ageInMonths}`);
  }
}