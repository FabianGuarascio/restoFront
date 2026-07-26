import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@core/state/auth.store';

export const guestGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  await authStore.verificarSesion();
  return authStore.estaLogueado() ? router.createUrlTree(['/pedidos']) : true;
};
