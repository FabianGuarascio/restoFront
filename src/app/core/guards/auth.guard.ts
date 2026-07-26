import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@core/state/auth.store';

export const authGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  await authStore.verificarSesion();
  return authStore.estaLogueado() ? true : router.createUrlTree(['/login']);
};
