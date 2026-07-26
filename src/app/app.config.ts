import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { credentialsInterceptor } from '@core/interceptors/credentials.interceptor';
import { csrfInterceptor } from '@core/interceptors/csrf.interceptor';
import { authExpiredInterceptor } from '@core/interceptors/auth-expired.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        credentialsInterceptor,
        csrfInterceptor,
        authExpiredInterceptor,
      ]),
    ),
    provideAnimationsAsync(),
  ],
};
