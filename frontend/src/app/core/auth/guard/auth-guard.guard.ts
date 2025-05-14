import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuardGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (!token) {
    return true; // allow login access
  }

  const decoded = authService.decodeToken();
  if (decoded?.role === 'ADMIN') {
    return router.parseUrl('/admin');
  }
  if (decoded?.role === 'CONTRIBUTOR') {
    return router.parseUrl('/contributorLayout');
  }
  if (decoded?.enabled === false) {
  authService.logout(); // 👈 triggers token removal and redirect
  return router.parseUrl('/login');
  }
  return router.parseUrl('/marketplace'); // fallback for USER or unknown
};
