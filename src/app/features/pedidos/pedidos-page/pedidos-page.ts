import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '@core/services/pedido.service';
import { MesaService } from '@core/services/mesa.service';
import { ProductoService } from '@core/services/producto.service';
import {
  Pedido,
  PedidoEstado,
  PedidoResumen,
  PEDIDO_TRANSICIONES_VALIDAS,
} from '../../../core/models/pedido.model';
import { Mesa } from '@core/models/mesa.model';
import { Producto } from '@core/models/producto.model';

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
  private readonly pedidoService = inject(PedidoService);
  private readonly mesaService = inject(MesaService);
  private readonly productoService = inject(ProductoService);

  readonly pedidos = signal<PedidoResumen[]>([]);
  readonly mesasLibres = signal<Mesa[]>([]);
  readonly productosDisponibles = signal<Producto[]>([]);
  readonly pedidoSeleccionado = signal<Pedido | null>(null);
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
    this.cargarPedidos();
    this.cargarMesasLibres();
    this.productoService
      .getAll()
      .subscribe((data) =>
        this.productosDisponibles.set(data.filter((p) => p.disponible)),
      );
  }

  cargarPedidos(): void {
    this.pedidoService.getAll().subscribe({
      next: (data) => this.pedidos.set(data),
      error: () => this.error.set('No se pudieron cargar los pedidos.'),
    });
  }

  cargarMesasLibres(): void {
    this.mesaService
      .getAll()
      .subscribe((data) =>
        this.mesasLibres.set(data.filter((m) => m.estado === 'Libre')),
      );
  }

  seleccionar(resumen: PedidoResumen): void {
    this.pedidoService.getById(resumen.id).subscribe({
      next: (pedido) => this.pedidoSeleccionado.set(pedido),
      error: () => this.error.set('No se pudo abrir el pedido.'),
    });
  }

  crearPedido(): void {
    if (this.mesaParaNuevoPedido === null) {
      return;
    }

    this.pedidoService.crear(this.mesaParaNuevoPedido).subscribe({
      next: (pedido) => {
        this.mostrarNuevoPedido.set(false);
        this.mesaParaNuevoPedido = null;
        this.cargarPedidos();
        this.cargarMesasLibres();
        this.pedidoSeleccionado.set(pedido);
      },
      error: () => this.error.set('No se pudo crear el pedido.'),
    });
  }

  agregarItem(): void {
    const pedido = this.pedidoSeleccionado();
    if (
      !pedido ||
      this.itemForm.productoId === null ||
      this.itemForm.cantidad < 1
    ) {
      return;
    }

    this.pedidoService
      .agregarItem(pedido.id, {
        productoId: this.itemForm.productoId,
        cantidad: this.itemForm.cantidad,
        notas: this.itemForm.notas.trim() || null,
      })
      .subscribe({
        next: (actualizado) => {
          this.pedidoSeleccionado.set(actualizado);
          this.itemForm = { ...ITEM_FORM_VACIO };
          this.cargarPedidos();
        },
        error: () => this.error.set('No se pudo agregar el ítem.'),
      });
  }

  quitarItem(itemId: number): void {
    const pedido = this.pedidoSeleccionado();
    if (!pedido) {
      return;
    }

    this.pedidoService.quitarItem(pedido.id, itemId).subscribe({
      next: (actualizado) => {
        this.pedidoSeleccionado.set(actualizado);
        this.cargarPedidos();
      },
      error: () => this.error.set('No se pudo quitar el ítem.'),
    });
  }

  cambiarEstado(nuevoEstado: PedidoEstado): void {
    const pedido = this.pedidoSeleccionado();
    if (!pedido) {
      return;
    }

    this.pedidoService.cambiarEstado(pedido.id, nuevoEstado).subscribe({
      next: (actualizado) => {
        this.pedidoSeleccionado.set(actualizado);
        this.cargarPedidos();
        this.cargarMesasLibres();
      },
      error: () => this.error.set('No se pudo cambiar el estado del pedido.'),
    });
  }
}
