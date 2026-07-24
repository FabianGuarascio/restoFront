import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { PedidoAPI } from '@core/services/pedido.service';
import {
  Pedido,
  PedidoEstado,
  PedidoItemCreate,
  PedidoResumen,
} from '@core/models/pedido.model';
import { MesasStore } from './mesas.store';

interface PedidosState {
  resumenes: PedidoResumen[];
  detalles: Record<number, Pedido>;
  seleccionadoId: number | null;
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: PedidosState = {
  resumenes: [],
  detalles: {},
  seleccionadoId: null,
  loaded: false,
  loading: false,
  error: null,
};

function derivarResumen(pedido: Pedido): PedidoResumen {
  const { id, mesaId, mesaNumero, estado, fechaCreacion, total } = pedido;
  return { id, mesaId, mesaNumero, estado, fechaCreacion, total };
}

export const PedidosStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ seleccionadoId, detalles }) => ({
    seleccionado: computed(() => {
      const id = seleccionadoId();
      return id !== null ? (detalles()[id] ?? null) : null;
    }),
  })),
  withMethods(
    (store, service = inject(PedidoAPI), mesasStore = inject(MesasStore)) => ({
      async load(force = false): Promise<void> {
        if (store.loaded() && !force) {
          return;
        }
        patchState(store, { loading: true, error: null });
        try {
          const resumenes = await firstValueFrom(service.getAll());
          patchState(store, { resumenes, loaded: true, loading: false });
        } catch {
          patchState(store, {
            loading: false,
            error: 'No se pudieron cargar los pedidos.',
          });
        }
      },

      async seleccionar(id: number): Promise<void> {
        if (store.detalles()[id]) {
          patchState(store, { seleccionadoId: id });
          return;
        }
        const pedido = await firstValueFrom(service.getById(id));
        patchState(store, {
          detalles: { ...store.detalles(), [id]: pedido },
          seleccionadoId: id,
        });
      },

      async crear(mesaId: number): Promise<void> {
        const pedido = await firstValueFrom(service.crear(mesaId));
        patchState(store, {
          resumenes: [...store.resumenes(), derivarResumen(pedido)],
          detalles: { ...store.detalles(), [pedido.id]: pedido },
          seleccionadoId: pedido.id,
        });
        mesasStore.sincronizarEstado(mesaId, 'Ocupada');
      },

      async agregarItem(
        pedidoId: number,
        item: PedidoItemCreate,
      ): Promise<void> {
        const pedido = await firstValueFrom(
          service.agregarItem(pedidoId, item),
        );
        patchState(store, {
          detalles: { ...store.detalles(), [pedidoId]: pedido },
          resumenes: store
            .resumenes()
            .map((r) => (r.id === pedidoId ? derivarResumen(pedido) : r)),
        });
      },

      async quitarItem(pedidoId: number, itemId: number): Promise<void> {
        const pedido = await firstValueFrom(
          service.quitarItem(pedidoId, itemId),
        );
        patchState(store, {
          detalles: { ...store.detalles(), [pedidoId]: pedido },
          resumenes: store
            .resumenes()
            .map((r) => (r.id === pedidoId ? derivarResumen(pedido) : r)),
        });
      },

      async cambiarEstado(
        pedidoId: number,
        nuevoEstado: PedidoEstado,
      ): Promise<void> {
        const pedido = await firstValueFrom(
          service.cambiarEstado(pedidoId, nuevoEstado),
        );
        patchState(store, {
          detalles: { ...store.detalles(), [pedidoId]: pedido },
          resumenes: store
            .resumenes()
            .map((r) => (r.id === pedidoId ? derivarResumen(pedido) : r)),
        });
        if (nuevoEstado === 'Pagado') {
          mesasStore.sincronizarEstado(pedido.mesaId, 'Libre');
        }
      },
    }),
  ),
);
