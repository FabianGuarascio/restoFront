import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidosStore } from '@core/state/pedidos.store';
import { ProductosStore } from '@core/state/productos.store';
import {
  Pedido,
  PedidoEstado,
  PEDIDO_TRANSICIONES_VALIDAS,
} from '@core/models/pedido.model';
import { ClaseEstadoPedidoPipe } from '../clase-estado-pedido.pipe';

interface ItemForm {
  productoId: number | null;
  cantidad: number;
  notas: string;
}

const ITEM_FORM_VACIO: ItemForm = { productoId: null, cantidad: 1, notas: '' };
const ESTADOS_MODIFICABLES: PedidoEstado[] = ['Pendiente', 'EnPreparacion'];

@Component({
  selector: 'app-pedido-detalle',
  imports: [FormsModule, ClaseEstadoPedidoPipe],
  templateUrl: './pedido-detalle.html',
})
export class PedidoDetalle {
  private readonly pedidosStore = inject(PedidosStore);
  private readonly productosStore = inject(ProductosStore);

  readonly pedido = input.required<Pedido>();
  readonly productosDisponibles = this.productosStore.disponibles;
  readonly error = signal<string | null>(null);

  itemForm: ItemForm = { ...ITEM_FORM_VACIO };

  readonly puedeModificarItems = computed(() =>
    ESTADOS_MODIFICABLES.includes(this.pedido().estado),
  );

  readonly transicionesDisponibles = computed(
    () => PEDIDO_TRANSICIONES_VALIDAS[this.pedido().estado],
  );

  constructor() {
    this.productosStore.load();
  }

  async agregarItem(): Promise<void> {
    if (this.itemForm.productoId === null || this.itemForm.cantidad < 1) {
      return;
    }

    try {
      await this.pedidosStore.agregarItem(this.pedido().id, {
        productoId: this.itemForm.productoId,
        cantidad: this.itemForm.cantidad,
        notas: this.itemForm.notas.trim() || null,
      });
      this.itemForm = { ...ITEM_FORM_VACIO };
    } catch {
      this.error.set('No se pudo agregar el ítem.');
    }
  }

  async quitarItem(itemId: number): Promise<void> {
    try {
      await this.pedidosStore.quitarItem(this.pedido().id, itemId);
    } catch {
      this.error.set('No se pudo quitar el ítem.');
    }
  }

  async cambiarEstado(nuevoEstado: PedidoEstado): Promise<void> {
    try {
      await this.pedidosStore.cambiarEstado(this.pedido().id, nuevoEstado);
    } catch {
      this.error.set('No se pudo cambiar el estado del pedido.');
    }
  }
}
