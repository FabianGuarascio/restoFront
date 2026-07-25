import { Component, inject, output, signal } from '@angular/core';
import { form, FormField, min, required, submit } from '@angular/forms/signals';
import { MesasStore } from '@core/state/mesas.store';
import { Modal } from '@shared/components/modal/modal';

interface MesaFormModel {
  numero: number | null;
  capacidad: number | null;
}

@Component({
  selector: 'app-modal-crear-mesa',
  imports: [FormField, Modal],
  templateUrl: './modal-crear-mesa.html',
})
export class ModalCrearMesa {
  private readonly mesasStore = inject(MesasStore);

  readonly cerrar = output<void>();

  private readonly modelo = signal<MesaFormModel>({ numero: null, capacidad: null });

  readonly mesaForm = form(this.modelo, (f) => {
    required(f.numero, { message: 'Ingresá un número de mesa.' });
    min(f.numero, 1, { message: 'El número debe ser mayor a 0.' });
    required(f.capacidad, { message: 'Ingresá una capacidad.' });
    min(f.capacidad, 1, { message: 'La capacidad debe ser mayor a 0.' });
  });

  async guardar(): Promise<void> {
    this.mesaForm().markAsTouched();
    await submit(this.mesaForm, async () => {
      const { numero, capacidad } = this.mesaForm().value();
      try {
        await this.mesasStore.crear({ numero: numero!, capacidad: capacidad! });
        this.cerrar.emit();
        return undefined;
      } catch {
        return [
          {
            fieldTree: this.mesaForm.numero,
            kind: 'server',
            message: 'No se pudo crear la mesa (¿número repetido?).',
          },
        ];
      }
    });
  }
}
