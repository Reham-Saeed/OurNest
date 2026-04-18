import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PeriodPayload {
  startDate: string;
  endDate: string;
  cycleLengthDays: number;
  periodLengthDays: number;
  flowIntensity: string;
  symptoms: string;
  notes: string;
}

export interface PeriodPredictions {
  nextPeriodStart: string;
  nextPeriodEnd: string;
  fertilityWindowStart: string;
  fertilityWindowEnd: string;
  ovulationDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class PeriodTrackerService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5038/api/Period';

  getPeriods(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addPeriod(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }

  getPredictions(): Observable<PeriodPredictions> {
    return this.http.get<PeriodPredictions>(`${this.apiUrl}/predictions`);
  }
}
