import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MesaService } from '@core/services/mesa.service';
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
  private readonly mesaService = inject(MesaService);

  readonly mesas = signal<Mesa[]>([]);
  readonly error = signal<string | null>(null);
  readonly mostrarForm = signal(false);
  form: MesaForm = { ...FORM_VACIO };

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.mesaService.getAll().subscribe({
      next: (data) => this.mesas.set(data),
      error: () => this.error.set('No se pudieron cargar las mesas.'),
    });
  }

  crear(): void {
    if (this.form.numero === null || this.form.capacidad === null) {
      return;
    }

    this.mesaService
      .create({ numero: this.form.numero, capacidad: this.form.capacidad })
      .subscribe({
        next: () => {
          this.form = { ...FORM_VACIO };
          this.mostrarForm.set(false);
          this.cargar();
        },
        error: () => this.error.set('No se pudo crear la mesa (¿número repetido?).'),
      });
  }

  reservar(mesa: Mesa): void {
    this.mesaService
      .update(mesa.id, { numero: mesa.numero, capacidad: mesa.capacidad, estado: 'Reservada' })
      .subscribe({
        next: () => this.cargar(),
        error: () => this.error.set('No se pudo reservar la mesa.'),
      });
  }

  liberar(mesa: Mesa): void {
    this.mesaService
      .update(mesa.id, { numero: mesa.numero, capacidad: mesa.capacidad, estado: 'Libre' })
      .subscribe({
        next: () => this.cargar(),
        error: () => this.error.set('No se pudo liberar la mesa.'),
      });
  }

  eliminar(mesa: Mesa): void {
    if (!confirm(`¿Eliminar la mesa ${mesa.numero}?`)) {
      return;
    }

    this.mesaService.delete(mesa.id).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('No se pudo eliminar la mesa.'),
    });
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
