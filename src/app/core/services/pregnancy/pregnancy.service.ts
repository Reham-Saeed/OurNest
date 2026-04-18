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
    return this.http.post(`${baseUrl}pregnancy/start`, data);
  }

  getCurrentPregnancy() {
    return this.http.get(`${baseUrl}pregnancy/current`).pipe(
      map((res: any) => {
        const week = res.currentWeek;

        let trimester: 'first' | 'second' | 'third';

        if (week <= 12) {
          trimester = 'first';
        } else if (week <= 27) {
          trimester = 'second';
        } else {
          trimester = 'third';
        }

        return {
          ...res,
          trimester,
        };
      }),
    );
  }

  updatePregnancy(data: any) {
    return this.http.put(`${baseUrl}pregnancy`, data);
  }
}
