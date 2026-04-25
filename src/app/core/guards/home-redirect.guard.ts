import { CanActivateFn, Router } from '@angular/router';
import { MotherService } from '../services/mother/mother.service';
import { inject } from '@angular/core';
import { map, catchError, of, take } from 'rxjs';
import { AuthService, User } from '../services/auth.service';
import { PartnerService } from '../services/partner/partner.service';
import { AppStateService } from '../services/app-state/app-state.service';

export const homeRedirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const appStateService = inject(AppStateService);

  return appStateService.state$.pipe(
    take(1),
    map((appState) => {
      // no state
      if (!appState) {
        return router.createUrlTree(['/questions-flow']);
      }

      // Father flow
      if (appState.role === 'Father') {
        if (!appState.isLinked) {
          return state.url === '/settings'
            ? true
            : router.createUrlTree(['/settings'], {
                queryParams: { section: 'partner' },
              });
        }

        if (appState.mode === 'babycare') {
          return router.createUrlTree(['/baby-care']);
        }

        if (appState.mode === 'pregnancy') {
          if (appState.currentWeek <= 12) return router.createUrlTree(['/trimester/first']);
          if (appState.currentWeek <= 27) return router.createUrlTree(['/trimester/second']);
          return router.createUrlTree(['/trimester/third']);
        }
      }

      // Mother flow
      if (appState.mode === 'babycare') {
        return router.createUrlTree(['/baby-care']);
      }

      if (appState.mode === 'pregnancy') {
        if (appState.currentWeek <= 12) return router.createUrlTree(['/trimester/first']);
        if (appState.currentWeek <= 27) return router.createUrlTree(['/trimester/second']);
        return router.createUrlTree(['/trimester/third']);
      }

      return router.createUrlTree(['/period-tracker']);
    }),
  );
};
