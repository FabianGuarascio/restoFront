import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { AuthAPI } from '@core/services/API/authAPI';
import { CsrfTokenService } from '@core/services/csrf-token.service';
import { Usuario } from '@core/models/usuario.model';

interface AuthState {
  usuario: Usuario | null;
  loading: boolean;
  error: string | null;
  checked: boolean;
}

const initialState: AuthState = {
  usuario: null,
  loading: false,
  error: null,
  checked: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ usuario }) => ({
    estaLogueado: computed(() => usuario() !== null),
  })),
  withMethods(
    (
      store,
      service = inject(AuthAPI),
      csrfTokenService = inject(CsrfTokenService),
    ) => ({
      async verificarSesion(): Promise<void> {
        if (store.checked()) {
          return;
        }
        try {
          const { token } = await firstValueFrom(service.token());
          csrfTokenService.set(token);
        } catch {
          // Sin token CSRF no se van a poder hacer requests que modifiquen datos;
          // se reintenta en el próximo login/navegación, no bloquea verificarSesion.
        }
        try {
          const usuario = await firstValueFrom(service.me());
          patchState(store, { usuario, checked: true });
        } catch {
          patchState(store, { usuario: null, checked: true });
        }
      },

      async login(nombreUsuario: string, password: string): Promise<void> {
        patchState(store, { loading: true, error: null });
        try {
          const usuario = await firstValueFrom(
            service.login({ nombreUsuario, password }),
          );
          patchState(store, { usuario, loading: false, checked: true });
          // El token CSRF de antes del login quedó atado a la identidad anónima;
          // hay que renovarlo para que las próximas requests (logout, altas, etc.)
          // no fallen por "distinto usuario" contra el backend.
          try {
            const { token } = await firstValueFrom(service.token());
            csrfTokenService.set(token);
          } catch {
            // No bloquea el login; en el peor caso la próxima request con el token
            // viejo fallará y el interceptor de 401/403 lo va a manejar.
          }
        } catch {
          patchState(store, {
            loading: false,
            error: 'Usuario o contraseña incorrectos.',
          });
        }
      },

      async logout(): Promise<void> {
        try {
          await firstValueFrom(service.logout());
        } catch {
          // El estado local se limpia igual aunque la request de logout falle.
        }
        // checked=false fuerza a que la próxima verificarSesion() (la dispara el guard
        // de /login) pida un token CSRF nuevo, atado ya a la identidad anónima —
        // el que se estaba usando quedó atado al usuario que acaba de salir.
        patchState(store, { usuario: null, checked: false });
      },

      limpiarSesion(): void {
        patchState(store, { usuario: null, checked: false });
      },
    }),
  ),
);
