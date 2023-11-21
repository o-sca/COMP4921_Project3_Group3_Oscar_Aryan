import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (auth.authenticated) {
    if (route.data['role'] && route.data['role'].indexOf(auth.role) === -1) {
      return router.createUrlTree(['']);
    }
    return true;
  }
  return router.createUrlTree(['signin']);
};
