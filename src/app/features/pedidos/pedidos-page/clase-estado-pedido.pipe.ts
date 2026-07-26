import { Pipe, PipeTransform } from '@angular/core';
import { PedidoEstado } from '@core/models/pedido.model';

@Pipe({
  name: 'claseEstadoPedido',
})
export class ClaseEstadoPedidoPipe implements PipeTransform {
  transform(estado: PedidoEstado): string {
    switch (estado) {
      case 'Pendiente':
        return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'EnPreparacion':
        return 'bg-slate-100 border-slate-400 text-slate-800';
      case 'Listo':
        return 'bg-amber-100 border-amber-400 text-amber-800';
      case 'Entregado':
        return 'bg-indigo-100 border-indigo-400 text-indigo-800';
      case 'Pagado':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'Cancelado':
        return 'bg-red-100 border-red-400 text-red-800';
    }
  }
}
