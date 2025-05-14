import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const decoded = authService.decodeToken();
  if (decoded?.role === 'ADMIN') {
    return true;
  }

  router.navigate(['/accessDenied']);
  return false;
};
