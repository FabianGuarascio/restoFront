import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MesasStore } from '@core/state/mesas.store';
import { MesaItem } from './mesa-item/mesa-item';

interface MesaForm {
  numero: number | null;
  capacidad: number | null;
}

const FORM_VACIO: MesaForm = { numero: null, capacidad: null };

@Component({
  selector: 'app-mesas-page',
  imports: [FormsModule, MesaItem],
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
}
