import { Pipe, PipeTransform } from '@angular/core';
import { PedidoEstado } from '@core/models/pedido.model';

@Pipe({
  name: 'claseEstadoPedido',
})
export class ClaseEstadoPedidoPipe implements PipeTransform {
  transform(estado: PedidoEstado): string {
    switch (estado) {
      case 'Pendiente':
        return 'bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300';
      case 'EnPreparacion':
        return 'bg-slate-100 border-slate-400 text-slate-800 dark:bg-slate-700/60 dark:border-slate-500 dark:text-slate-200';
      case 'Listo':
        return 'bg-amber-100 border-amber-400 text-amber-800 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-300';
      case 'Entregado':
        return 'bg-indigo-100 border-indigo-400 text-indigo-800 dark:bg-indigo-900/40 dark:border-indigo-700 dark:text-indigo-300';
      case 'Pagado':
        return 'bg-green-100 border-green-400 text-green-800 dark:bg-green-900/40 dark:border-green-700 dark:text-green-300';
      case 'Cancelado':
        return 'bg-red-100 border-red-400 text-red-800 dark:bg-red-900/40 dark:border-red-700 dark:text-red-300';
    }
  }
}
