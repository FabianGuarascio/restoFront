import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidosStore } from '@core/state/pedidos.store';
import { MesasStore } from '@core/state/mesas.store';
import { ProductosStore } from '@core/state/productos.store';
import {
  PedidoEstado,
  PedidoResumen,
  PEDIDO_TRANSICIONES_VALIDAS,
} from '../../../core/models/pedido.model';

interface ItemForm {
  productoId: number | null;
  cantidad: number;
  notas: string;
}

const ITEM_FORM_VACIO: ItemForm = { productoId: null, cantidad: 1, notas: '' };
const ESTADOS_MODIFICABLES: PedidoEstado[] = ['Pendiente', 'EnPreparacion'];

@Component({
  selector: 'app-pedidos-page',
  imports: [FormsModule],
  templateUrl: './pedidos-page.html',
})
export class PedidosPage implements OnInit {
  private readonly pedidosStore = inject(PedidosStore);
  private readonly mesasStore = inject(MesasStore);
  private readonly productosStore = inject(ProductosStore);

  readonly pedidos = this.pedidosStore.resumenes;
  readonly mesasLibres = this.mesasStore.libres;
  readonly productosDisponibles = this.productosStore.disponibles;
  readonly pedidoSeleccionado = this.pedidosStore.seleccionado;
  readonly mostrarNuevoPedido = signal(false);
  readonly error = signal<string | null>(null);

  mesaParaNuevoPedido: number | null = null;
  itemForm: ItemForm = { ...ITEM_FORM_VACIO };

  readonly puedeModificarItems = computed(() => {
    const pedido = this.pedidoSeleccionado();
    return !!pedido && ESTADOS_MODIFICABLES.includes(pedido.estado);
  });

  readonly transicionesDisponibles = computed(() => {
    const pedido = this.pedidoSeleccionado();
    return pedido ? PEDIDO_TRANSICIONES_VALIDAS[pedido.estado] : [];
  });

  ngOnInit(): void {
    this.pedidosStore.load();
    this.mesasStore.load();
    this.productosStore.load();
  }

  async seleccionar(resumen: PedidoResumen): Promise<void> {
    try {
      await this.pedidosStore.seleccionar(resumen.id);
    } catch {
      this.error.set('No se pudo abrir el pedido.');
    }
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

  async agregarItem(): Promise<void> {
    const pedido = this.pedidoSeleccionado();
    if (
      !pedido ||
      this.itemForm.productoId === null ||
      this.itemForm.cantidad < 1
    ) {
      return;
    }

    try {
      await this.pedidosStore.agregarItem(pedido.id, {
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
    const pedido = this.pedidoSeleccionado();
    if (!pedido) {
      return;
    }

    try {
      await this.pedidosStore.quitarItem(pedido.id, itemId);
    } catch {
      this.error.set('No se pudo quitar el ítem.');
    }
  }

  async cambiarEstado(nuevoEstado: PedidoEstado): Promise<void> {
    const pedido = this.pedidoSeleccionado();
    if (!pedido) {
      return;
    }

    try {
      await this.pedidosStore.cambiarEstado(pedido.id, nuevoEstado);
    } catch {
      this.error.set('No se pudo cambiar el estado del pedido.');
    }
  }
}
