import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DecodedToken } from '../../../shared/decoded-token';
import { AuthService } from '../services/auth.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (!token) {
    return true; 
  }

  const decoded = authService.decodeToken();
  if (decoded?.role === 'CONTRIBUTOR') {
    router.navigate(['/contributorLayout']);
  } else {
    router.navigate(['/marketplace']);
  }
  return false;
};
