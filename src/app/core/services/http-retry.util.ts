import { Observable, timeout } from 'rxjs';
import { retry } from 'rxjs/operators';

/**
 * Timeout (5s) + retry (2 reintentos, 3 intentos totales) para requests GET
 * idempotentes. Pensado para mitigar el cold start del backend en Azure App
 * Service plan F1. No usar en mutaciones (POST/PUT/PATCH/DELETE).
 */
export function conRetryPorColdStart<T>(source: Observable<T>): Observable<T> {
  return source.pipe(timeout(5000), retry({ count: 2 }));
}
