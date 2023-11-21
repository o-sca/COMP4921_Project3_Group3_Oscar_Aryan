import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthedGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  const customRedirect = route.data['customRedirect'];

  if (auth.authenticated) {
    return router.createUrlTree([customRedirect]);
  }
  return true;
};
