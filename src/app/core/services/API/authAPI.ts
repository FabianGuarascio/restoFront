import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { Usuario, UsuarioLogin } from '../../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthAPI {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  login(dto: UsuarioLogin) {
    return this.http.post<Usuario>(`${this.baseUrl}/login`, dto);
  }

  logout() {
    return this.http.post<void>(`${this.baseUrl}/logout`, {});
  }

  me() {
    return this.http.get<Usuario>(`${this.baseUrl}/me`);
  }

  token() {
    return this.http.get<{ token: string }>(`${this.baseUrl}/token`);
  }
}
