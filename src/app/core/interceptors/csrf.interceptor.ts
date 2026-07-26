import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CsrfTokenService } from '@core/services/csrf-token.service';

const METODOS_SEGUROS = new Set(['GET', 'HEAD', 'OPTIONS']);

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfTokenService = inject(CsrfTokenService);

  if (METODOS_SEGUROS.has(req.method) || !csrfTokenService.token) {
    return next(req);
  }

  return next(
    req.clone({ setHeaders: { 'X-XSRF-TOKEN': csrfTokenService.token } }),
  );
};
