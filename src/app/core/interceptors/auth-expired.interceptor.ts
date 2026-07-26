import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '@core/state/auth.store';

export const authExpiredInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  return next(req).pipe(
    catchError((err) => {
      const esRutaDeAuth = req.url.includes('/auth/me') || req.url.includes('/auth/login');
      if (err instanceof HttpErrorResponse && err.status === 401 && !esRutaDeAuth) {
        authStore.limpiarSesion();
        router.navigateByUrl('/login');
      }
      return throwError(() => err);
    }),
  );
};
