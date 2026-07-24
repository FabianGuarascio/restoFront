import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MesasStore } from '@core/state/mesas.store';
import { Mesa } from '@core/models/mesa.model';

interface MesaForm {
  numero: number | null;
  capacidad: number | null;
}

const FORM_VACIO: MesaForm = { numero: null, capacidad: null };

@Component({
  selector: 'app-mesas-page',
  imports: [FormsModule],
  templateUrl: './mesas-page.html',
})
export class MesasPage implements OnInit {
  private readonly mesasStore = inject(MesasStore);

  readonly mesas = this.mesasStore.items;
  readonly error = signal<string | null>(null);
  readonly mostrarForm = signal(false);
  form: MesaForm = { ...FORM_VACIO };

  ngOnInit(): void {
    this.mesasStore.load();
  }

  async crear(): Promise<void> {
    if (this.form.numero === null || this.form.capacidad === null) {
      return;
    }

    try {
      await this.mesasStore.crear({
        numero: this.form.numero,
        capacidad: this.form.capacidad,
      });
      this.form = { ...FORM_VACIO };
      this.mostrarForm.set(false);
    } catch {
      this.error.set('No se pudo crear la mesa (¿número repetido?).');
    }
  }

  async reservar(mesa: Mesa): Promise<void> {
    try {
      await this.mesasStore.actualizar(mesa.id, {
        numero: mesa.numero,
        capacidad: mesa.capacidad,
        estado: 'Reservada',
      });
    } catch {
      this.error.set('No se pudo reservar la mesa.');
    }
  }

  async liberar(mesa: Mesa): Promise<void> {
    try {
      await this.mesasStore.actualizar(mesa.id, {
        numero: mesa.numero,
        capacidad: mesa.capacidad,
        estado: 'Libre',
      });
    } catch {
      this.error.set('No se pudo liberar la mesa.');
    }
  }

  async eliminar(mesa: Mesa): Promise<void> {
    if (!confirm(`¿Eliminar la mesa ${mesa.numero}?`)) {
      return;
    }

    try {
      await this.mesasStore.eliminar(mesa.id);
    } catch {
      this.error.set('No se pudo eliminar la mesa.');
    }
  }

  claseEstado(mesa: Mesa): string {
    switch (mesa.estado) {
      case 'Libre':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'Ocupada':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'Reservada':
        return 'bg-amber-100 border-amber-400 text-amber-800';
    }
  }
}
