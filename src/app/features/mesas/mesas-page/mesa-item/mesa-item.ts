import { Component, computed, inject, input, signal } from '@angular/core';
import { CdkDragHandle } from '@angular/cdk/drag-drop';
import { Mesa } from '@core/models/mesa.model';
import { MesasStore } from '@core/state/mesas.store';
import { ModalEliminar } from '@shared/components/modal-eliminar/modal-eliminar';
import { ClaseEstadoMesaPipe } from './clase-estado-mesa.pipe';

@Component({
  selector: 'app-mesa-item',
  imports: [ModalEliminar, ClaseEstadoMesaPipe, CdkDragHandle],
  templateUrl: './mesa-item.html',
})
export class MesaItem {
  private readonly mesasStore = inject(MesasStore);

  readonly mesa = input.required<Mesa>();
  readonly error = signal<string | null>(null);
  readonly confirmandoEliminar = signal(false);

  readonly itemAEliminar = computed(() =>
    this.confirmandoEliminar()
      ? { id: this.mesa().id, nombre: String(this.mesa().numero) }
      : null,
  );

  async accion(tipo: 'reservar' | 'liberar' | 'eliminar'): Promise<void> {
    if (tipo === 'eliminar') {
      this.confirmandoEliminar.set(true);
      return;
    }

    const mesa = this.mesa();
    try {
      await this.mesasStore.actualizar(mesa.id, {
        numero: mesa.numero,
        capacidad: mesa.capacidad,
        estado: tipo === 'reservar' ? 'Reservada' : 'Libre',
      });
    } catch {
      this.error.set('No se pudo actualizar la mesa.');
    }
  }
}
