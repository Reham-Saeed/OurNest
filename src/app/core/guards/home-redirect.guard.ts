import { CanActivateFn, Router } from '@angular/router';
import { MotherService } from '../services/mother/mother.service';
import { inject } from '@angular/core';
import { map, catchError, of, take } from 'rxjs';

export const homeRedirectGuard: CanActivateFn = (route, state) => {
  const _MotherService = inject(MotherService);
  const router = inject(Router);

  return _MotherService.getMotherDashboard().pipe(
    map((res) => {
      const pregnancyStatus = res?.mother?.pregnancyStatus;
      const babiesCount = res?.babiesCount ?? 0;
      const currentWeek = res?.currentWeek ?? 0;

      if (babiesCount > 0) {
        return router.createUrlTree(['/baby-care']);
      }

      if (pregnancyStatus === 'Pregnant') {
        if (currentWeek <= 12) return router.createUrlTree(['/trimester/first']);
        if (currentWeek <= 27) return router.createUrlTree(['/trimester/second']);
        return router.createUrlTree(['/trimester/third']);
      }

      return router.createUrlTree(['/period-tracker']);
    }),

    catchError((err) => {
      if (err?.status === 404) {
        return of(router.createUrlTree(['/questions-flow']));
      }

      return of(router.createUrlTree(['/questions-flow']));
    }),
  );
};
