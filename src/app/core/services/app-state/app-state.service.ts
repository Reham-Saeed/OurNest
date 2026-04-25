import { Injectable } from '@angular/core';
import { PartnerService } from '../partner/partner.service';
import { BehaviorSubject, map, tap } from 'rxjs';
import { AuthService } from '../auth.service';

export type AppState = {
  role: 'Mother' | 'Father';
  isLinked: boolean;
  mode: 'planning' | 'pregnancy' | 'babycare';
  currentWeek: number;
};

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  constructor(
    private _PartnerService: PartnerService,
    private _AuthService: AuthService,
  ) {}

  private stateSubject = new BehaviorSubject<any>(this.getLocalState());
  state$ = this.stateSubject.asObservable();

  private resolveMode(res: any): 'planning' | 'pregnancy' | 'babycare' | 'pending' {
    const babies = res?.babyData?.babies ?? [];
    const pregnancy = res?.babyData?.pregnancy;

    if (babies.length > 0) {
      return 'babycare';
    }

    if (pregnancy) {
      return 'pregnancy';
    }
    if (babies.length < 0 && !pregnancy) {
      return 'planning';
    }
    return 'pending';
  }

  setAppState() {
    const role = this._AuthService.getUser()?.role;

    return this._PartnerService.getFamilyDashboard().pipe(
      map((res) => {
        const mode = this.resolveMode(res);

        return {
          role: role === 'Father' ? 'Father' : 'Mother',
          mode,
          isLinked: res?.isLinked ?? false,
          currentWeek: res?.babyData?.pregnancy?.currentWeek ?? 0,
        };
      }),

      tap((state) => {
        this.setLocalState(state);
      }),
    );
  }

  setLocalState(state: any) {
    localStorage.setItem('app-state', JSON.stringify(state));
    this.stateSubject.next(state);
  }
  getLocalState() {
    const state = localStorage.getItem('app-state');
    return state ? JSON.parse(state) : null;
  }
  updateState(patch: Partial<AppState>) {
    const current = this.stateSubject.value || {};

    const newState = {
      ...current,
      ...patch,
    };

    this.setLocalState(newState);
  }
}
