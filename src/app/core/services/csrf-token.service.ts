import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CsrfTokenService {
  private readonly _token = signal<string | null>(null);

  get token(): string | null {
    return this._token();
  }

  set(token: string): void {
    this._token.set(token);
  }
}
