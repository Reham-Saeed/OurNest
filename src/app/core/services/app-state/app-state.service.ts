import { Injectable } from '@angular/core';
import { PartnerService } from '../partner/partner.service';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../../environments/environment.local';

export type AppState = {
  role: 'Mother' | 'Father';
  isLinked: boolean;
  mode: 'planning' | 'pregnancy' | 'babycare' | 'pending';
  currentWeek: number;
};

export interface CurrentUser {
  id: string;
  email: string;
  role: 'Mother' | 'Father';
  emailConfirmed: boolean;
  fullName: string;
  profilePictureUrl: string | null;
  phoneNumber: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  constructor(
    private _PartnerService: PartnerService,
    private _HttpClient: HttpClient,
  ) {}

  getCurrentUser() {
    return this._HttpClient.get<CurrentUser>(`${baseUrl}users/me`);
  }

  private stateSubject = new BehaviorSubject<any>(this.getLocalState());
  state$ = this.stateSubject.asObservable();

  private resolveMode(
    res: any,
    role: 'Mother' | 'Father',
  ): 'planning' | 'pregnancy' | 'babycare' | 'pending' {
    const babies = res?.babyData?.babies ?? [];
    const pregnancy = res?.babyData?.pregnancy;
    const isLinked = res?.isLinked ?? false;

    if (role === 'Father' && !isLinked) {
      return 'pending';
    }

    if (babies.length > 0) {
      return 'babycare';
    }

    if (pregnancy) {
      return 'pregnancy';
    }

    return 'planning';
  }

  setAppState() {
    return this.getCurrentUser().pipe(
      switchMap((user: any) => {
        const role = user.role;
        return this._PartnerService.getFamilyDashboard().pipe(
          map((res: any) => {
            const hasBabyData = 'babyData' in res;

            if (!hasBabyData) {
              return null;
            }

            const babyData = res.babyData;

            const mode = this.resolveMode(res, role);
            return {
              role: role === 'Father' ? 'Father' : 'Mother',
              mode,
              isLinked: res?.isLinked ?? false,
              currentWeek: babyData?.pregnancy?.currentWeek ?? 0,
            };
          }),

          tap((state) => {
            if (!state) {
              localStorage.removeItem('app-state');
              return;
            }

            this.setLocalState(state);
          }),
        );
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
