// mother-state.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { MotherStateService } from '../services/mother-state/mother-state.service';
import { inject } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { PregnancyService } from '../services/pregnancy/pregnancy.service';

export const motherStateGuard: CanActivateFn = (route, state) => {
  const _MotherStateService = inject(MotherStateService);
  const _PregnancyService = inject(PregnancyService);
  const router = inject(Router);

  return _MotherStateService.getMotherState().pipe(
    switchMap((state) => {
      if (state === 'pregnant') {
        return _PregnancyService.getCurrentPregnancy().pipe(
          map((res: any) => {
            const trimester = res.trimester;

            if (trimester === 'first') {
              return router.createUrlTree(['/trimester/first']);
            }

            if (trimester === 'second') {
              return router.createUrlTree(['/trimester/second']);
            }

            if (trimester === 'third') {
              return router.createUrlTree(['/trimester/third']);
            }

            return router.createUrlTree(['/questions']);
          }),
        );
      }

      if (state === 'planning') {
        return [router.createUrlTree(['/period-tracker'])];
      }

      if (state === 'hasBaby') {
        return [router.createUrlTree(['/baby-care'])];
      }

      return [router.createUrlTree(['/questions'])];
    }),
  );
};
