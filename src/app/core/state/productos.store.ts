import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { ProductoAPI } from '@core/services/API/productoAPI';
import { conRetryPorColdStart } from '@core/services/http-retry.util';
import {
  Producto,
  ProductoCreate,
  ProductoUpdate,
} from '@core/models/producto.model';

interface ProductosState {
  items: Producto[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ProductosState = {
  items: [],
  loaded: false,
  loading: false,
  error: null,
};

export const ProductosStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ items }) => ({
    disponibles: computed(() => items().filter((p) => p.disponible)),
  })),
  withMethods((store, service = inject(ProductoAPI)) => ({
    async load(force = false): Promise<void> {
      if (store.loaded() && !force) {
        return;
      }
      patchState(store, { loading: true, error: null });
      try {
        const items = await firstValueFrom(
          service.getAll().pipe(conRetryPorColdStart),
        );
        patchState(store, { items, loaded: true, loading: false });
      } catch {
        patchState(store, {
          loading: false,
          error: 'No se pudieron cargar los productos.',
        });
      }
    },

    async crear(dto: ProductoCreate): Promise<void> {
      const creado = await firstValueFrom(service.create(dto));
      patchState(store, { items: [...store.items(), creado] });
    },

    async actualizar(id: number, dto: ProductoUpdate): Promise<void> {
      await firstValueFrom(service.update(id, dto));
      patchState(store, {
        items: store.items().map((p) => (p.id === id ? { ...p, ...dto } : p)),
      });
    },

    async eliminar(id: number): Promise<void> {
      await firstValueFrom(service.delete(id));
      patchState(store, { items: store.items().filter((p) => p.id !== id) });
    },
  })),
);
