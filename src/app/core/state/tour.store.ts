import { effect, inject } from '@angular/core';
import { patchState, signalStore, withHooks, withState } from '@ngrx/signals';
import { AuthStore } from './auth.store';
import { TourService } from '@core/services/tour.service';

function claveStorage(nombreUsuario: string): string {
  return `resto-tour-completado:${nombreUsuario}`;
}

export const TourStore = signalStore(
  { providedIn: 'root' },
  withState<{ enCurso: boolean }>({ enCurso: false }),
  withHooks({
    onInit(store) {
      const authStore = inject(AuthStore);
      const tourService = inject(TourService);

      effect(() => {
        const usuario = authStore.usuario();
        if (!usuario || store.enCurso()) return;

        const clave = claveStorage(usuario.nombreUsuario);
        if (localStorage.getItem(clave)) return;

        patchState(store, { enCurso: true });
        // Pequeño delay para dar tiempo a que el nav y la página de Pedidos
        // terminen de renderizar (el tour puede arrancar justo después de un
        // login recién resuelto, antes de que el router termine de navegar).
        setTimeout(() => {
          tourService.iniciar(() => {
            localStorage.setItem(clave, '1');
            patchState(store, { enCurso: false });
          });
        }, 300);
      });
    },
  }),
);
