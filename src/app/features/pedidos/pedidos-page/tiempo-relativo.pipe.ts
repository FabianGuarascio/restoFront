import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiempoRelativo',
  pure: false,
})
export class TiempoRelativoPipe implements PipeTransform {
  transform(fecha: string): string {
    const segundos = Math.floor((Date.now() - new Date(fecha).getTime()) / 1000);

    if (segundos < 60) {
      return 'hace unos segundos';
    }

    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) {
      return `hace ${minutos} minuto${minutos === 1 ? '' : 's'}`;
    }

    const horas = Math.floor(minutos / 60);
    if (horas < 24) {
      return `hace ${horas} hora${horas === 1 ? '' : 's'}`;
    }

    const dias = Math.floor(horas / 24);
    return `hace ${dias} día${dias === 1 ? '' : 's'}`;
  }
}
