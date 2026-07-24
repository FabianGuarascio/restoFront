import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { CategoriaAPI } from '@core/services/categoria.service';
import {
  Categoria,
  CategoriaCreate,
  CategoriaUpdate,
} from '@core/models/categoria.model';

interface CategoriasState {
  items: Categoria[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: CategoriasState = {
  items: [],
  loaded: false,
  loading: false,
  error: null,
};

export const CategoriasStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, service = inject(CategoriaAPI)) => ({
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
          error: 'No se pudieron cargar las categorías.',
        });
      }
    },

    async crear(dto: CategoriaCreate): Promise<void> {
      const creada = await firstValueFrom(service.create(dto));
      patchState(store, { items: [...store.items(), creada] });
    },

    async actualizar(id: number, dto: CategoriaUpdate): Promise<void> {
      await firstValueFrom(service.update(id, dto));
      patchState(store, {
        items: store.items().map((c) => (c.id === id ? { ...c, ...dto } : c)),
      });
    },

    async eliminar(id: number): Promise<void> {
      await firstValueFrom(service.delete(id));
      patchState(store, { items: store.items().filter((c) => c.id !== id) });
    },
  })),
);
