import { Component, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PedidosStore } from '@core/state/pedidos.store';
import { PedidoResumen } from '@core/models/pedido.model';
import { ClaseEstadoPedidoPipe } from '../clase-estado-pedido.pipe';
import { TiempoRelativoPipe } from '../tiempo-relativo.pipe';

@Component({
  selector: 'app-pedidos-tabla',
  imports: [ClaseEstadoPedidoPipe, DatePipe, TiempoRelativoPipe, MatTooltipModule],
  templateUrl: './pedidos-tabla.html',
  styleUrl: './pedidos-tabla.css',
})
export class PedidosTabla {
  private readonly pedidosStore = inject(PedidosStore);

  readonly titulo = input.required<string>();
  readonly pedidos = input.required<PedidoResumen[]>();
  readonly mensajeVacio = input.required<string>();

  readonly pedidoSeleccionado = this.pedidosStore.seleccionado;
  readonly colapsado = signal(false);
  readonly error = signal<string | null>(null);

  async seleccionar(resumen: PedidoResumen): Promise<void> {
    try {
      await this.pedidosStore.seleccionar(resumen.id);
    } catch {
      this.error.set('No se pudo abrir el pedido.');
    }
  }
}
