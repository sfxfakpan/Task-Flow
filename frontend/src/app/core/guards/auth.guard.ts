import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;

      if (Date.now() >= expiry) {
        localStorage.removeItem('token');
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }

      return true;
    } catch (error) {
      localStorage.removeItem('token');
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
  }

  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};
