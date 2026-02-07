import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard that protects admin routes.
 * Redirects to /admin/login if not authenticated.
 * Allows access while loading to permit session recovery on page reload.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // While loading, allow access (session is being recovered)
  if (auth.isLoading()) {
    return true;
  }

  // After loading, check if authenticated
  if (auth.isAuthenticated()) {
    return true;
  }

  // Not authenticated and loading finished → redirect to login
  return router.createUrlTree(['/admin/login']);
};
