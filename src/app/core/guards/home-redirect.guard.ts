import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';
import { AppStateService } from '../services/app-state/app-state.service';

export const homeRedirectGuard: CanActivateFn & CanActivateChildFn = (route, state) => {
  const router = inject(Router);
  const appStateService = inject(AppStateService);

  return appStateService.state$.pipe(
    take(1),
    map((appState) => {
      if (!localStorage.getItem('app-state')) {
        return router.createUrlTree(['/questions-flow']);
      }

      if (state.url === '/home' || state.url === '/') {
        // Father flow
        if (appState.role === 'Father') {
          if (!appState.isLinked) {
            return router.createUrlTree(['/settings'], {
              queryParams: { section: 'partner' },
            });
          }
          if (appState.mode === 'babycare') return router.createUrlTree(['/baby-care']);
          if (appState.mode === 'pregnancy') return router.createUrlTree(['/pregnancy-tracker']);
        }

        // Mother flow
        if (appState.mode === 'babycare') return router.createUrlTree(['/baby-care']);
        if (appState.mode === 'pregnancy') return router.createUrlTree(['/pregnancy-tracker']);

        return router.createUrlTree(['/period-tracker']);
      }

      return true;
    }),
  );
};