import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

  export const contributorGuardGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
  
    const token = authService.getToken();
    if (!token) {
      router.navigate(['/login']);
      return false;
    }
  
    const decoded = authService.decodeToken();
    if (decoded?.role === 'CONTRIBUTOR') {
      return true;
    }
  
    router.navigate(['/accessDenied']); // ✅ this was /login before
    return false;
  };
  
