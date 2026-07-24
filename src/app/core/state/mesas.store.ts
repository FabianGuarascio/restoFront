import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { MesaAPI } from '@core/services/mesa.service';
import {
  Mesa,
  MesaCreate,
  MesaEstado,
  MesaUpdate,
} from '@core/models/mesa.model';

interface MesasState {
  items: Mesa[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: MesasState = {
  items: [],
  loaded: false,
  loading: false,
  error: null,
};

export const MesasStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ items }) => ({
    libres: computed(() => items().filter((m) => m.estado === 'Libre')),
  })),
  withMethods((store, service = inject(MesaAPI)) => ({
    async load(force = false): Promise<void> {
      if (store.loaded() && !force) {
        return;
      }
      patchState(store, { loading: true, error: null });
      try {
        const items = await firstValueFrom(service.getAll());
        patchState(store, { items, loaded: true, loading: false });
      } catch {
        patchState(store, {
          loading: false,
          error: 'No se pudieron cargar las mesas.',
        });
      }
    },

    async crear(dto: MesaCreate): Promise<void> {
      const creada = await firstValueFrom(service.create(dto));
      patchState(store, { items: [...store.items(), creada] });
    },

    async actualizar(id: number, dto: MesaUpdate): Promise<void> {
      await firstValueFrom(service.update(id, dto));
      patchState(store, {
        items: store.items().map((m) => (m.id === id ? { ...m, ...dto } : m)),
      });
    },

    async eliminar(id: number): Promise<void> {
      await firstValueFrom(service.delete(id));
      patchState(store, { items: store.items().filter((m) => m.id !== id) });
    },

    // No es un CRUD real: PedidosStore usa esto para reflejar el efecto de dominio
    // "crear pedido ocupa la mesa" / "pagar pedido libera la mesa" a partir del
    // response del propio endpoint de Pedidos, sin volver a pegarle a la API de Mesas.
    sincronizarEstado(mesaId: number, estado: MesaEstado): void {
      patchState(store, {
        items: store
          .items()
          .map((m) => (m.id === mesaId ? { ...m, estado } : m)),
      });
    },
  })),
);
