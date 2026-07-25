import { Pipe, PipeTransform } from '@angular/core';
import { MesaEstado } from '@core/models/mesa.model';

@Pipe({
  name: 'claseEstadoMesa',
})
export class ClaseEstadoMesaPipe implements PipeTransform {
  transform(estado: MesaEstado): string {
    switch (estado) {
      case 'Libre':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'Ocupada':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'Reservada':
        return 'bg-amber-100 border-amber-400 text-amber-800';
    }
  }
}
