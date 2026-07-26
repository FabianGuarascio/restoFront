import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { interval } from 'rxjs';
import { PedidosStore } from '@core/state/pedidos.store';
import { MesasStore } from '@core/state/mesas.store';
import {
  ESTADOS_FINALIZADOS,
  PedidoEstado,
  TODOS_LOS_ESTADOS,
} from '../../../core/models/pedido.model';
import { PedidoDetalle } from './pedido-detalle/pedido-detalle';
import { PedidosTabla } from './pedidos-tabla/pedidos-tabla';

@Component({
  selector: 'app-pedidos-page',
  imports: [FormsModule, PedidoDetalle, PedidosTabla],
  templateUrl: './pedidos-page.html',
})
export class PedidosPage implements OnInit {
  private readonly pedidosStore = inject(PedidosStore);
  private readonly mesasStore = inject(MesasStore);

  readonly mesasLibres = this.mesasStore.libres;
  readonly pedidoSeleccionado = this.pedidosStore.seleccionado;
  readonly mostrarNuevoPedido = signal(false);
  readonly error = signal<string | null>(null);

  readonly todosLosEstados = TODOS_LOS_ESTADOS;
  readonly estadosFiltrados = signal<Set<PedidoEstado>>(
    new Set(TODOS_LOS_ESTADOS),
  );

  readonly pedidos = computed(() =>
    this.pedidosStore
      .resumenesOrdenados()
      .filter((r) => this.estadosFiltrados().has(r.estado)),
  );

  readonly pedidosActivos = computed(() =>
    this.pedidos().filter((r) => !ESTADOS_FINALIZADOS.includes(r.estado)),
  );

  readonly pedidosFinalizados = computed(() =>
    this.pedidos().filter((r) => ESTADOS_FINALIZADOS.includes(r.estado)),
  );

  readonly todosSeleccionados = computed(
    () => this.estadosFiltrados().size === TODOS_LOS_ESTADOS.length,
  );

  readonly algunoSeleccionado = computed(
    () => this.estadosFiltrados().size > 0 && !this.todosSeleccionados(),
  );

  mesaParaNuevoPedido: number | null = null;

  constructor() {
    // Fuerza un ciclo de detección de cambios cada 30s para que los "hace X"
    // (pipe impuro) se actualicen solos aunque el usuario no interactúe.
    interval(30_000)
      .pipe(takeUntilDestroyed())
      .subscribe();
  }

  toggleEstado(estado: PedidoEstado, marcado: boolean): void {
    const nuevo = new Set(this.estadosFiltrados());
    if (marcado) {
      nuevo.add(estado);
    } else {
      nuevo.delete(estado);
    }
    this.estadosFiltrados.set(nuevo);
  }

  toggleTodosLosEstados(marcado: boolean): void {
    this.estadosFiltrados.set(
      marcado ? new Set(TODOS_LOS_ESTADOS) : new Set(),
    );
  }

  ngOnInit(): void {
    this.pedidosStore.load();
    this.mesasStore.load();
  }

  async crearPedido(): Promise<void> {
    if (this.mesaParaNuevoPedido === null) {
      return;
    }

    try {
      await this.pedidosStore.crear(this.mesaParaNuevoPedido);
      this.mostrarNuevoPedido.set(false);
      this.mesaParaNuevoPedido = null;
    } catch {
      this.error.set('No se pudo crear el pedido.');
    }
  }
}
