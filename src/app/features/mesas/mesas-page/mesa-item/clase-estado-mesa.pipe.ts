import { Pipe, PipeTransform } from '@angular/core';
import { MesaEstado } from '@core/models/mesa.model';

@Pipe({
  name: 'claseEstadoMesa',
})
export class ClaseEstadoMesaPipe implements PipeTransform {
  transform(estado: MesaEstado): string {
    switch (estado) {
      case 'Libre':
        return 'bg-green-100 border-green-400 text-green-800 dark:bg-green-900/40 dark:border-green-700 dark:text-green-300';
      case 'Ocupada':
        return 'bg-red-100 border-red-400 text-red-800 dark:bg-red-900/40 dark:border-red-700 dark:text-red-300';
      case 'Reservada':
        return 'bg-amber-100 border-amber-400 text-amber-800 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-300';
    }
  }
}
