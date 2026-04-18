import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of, switchMap, tap } from 'rxjs';
import { BabyService } from '../baby/baby.service';
import { PregnancyService } from '../pregnancy/pregnancy.service';

export type MotherState = 'pregnant' | 'hasBaby' | 'planning';

@Injectable({
  providedIn: 'root',
})
export class MotherStateService {
  constructor(
    private _PregnancyService: PregnancyService,
    private _BabyService: BabyService,
  ) {}

  getMotherState() {
    return this._PregnancyService.getCurrentPregnancy().pipe(
      map(() => 'pregnant' as MotherState),
      catchError(() => {
        return this._BabyService.getAllBabies().pipe(
          map((babies: any[]) => {
            return babies.length ? 'hasBaby' : 'planning';
          }),
        );
      }),
    );
  }
}
