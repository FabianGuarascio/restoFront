import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriasStore } from '@core/state/categorias.store';
import { Categoria } from '@core/models/categoria.model';
import { CategoriaItem } from './categoria-item/categoria-item';

interface CategoriaForm {
  nombre: string;
  descripcion: string;
}

const FORM_VACIO: CategoriaForm = { nombre: '', descripcion: '' };

@Component({
  selector: 'app-categorias',
  imports: [FormsModule, CategoriaItem],
  templateUrl: './categorias.html',
})
export class Categorias implements OnInit {
  private readonly categoriasStore = inject(CategoriasStore);

  readonly categorias = this.categoriasStore.items;
  readonly editingId = signal<number | null>(null);
  readonly error = signal<string | null>(null);
  form: CategoriaForm = { ...FORM_VACIO };

  ngOnInit(): void {
    this.categoriasStore.load();
  }

  async guardar(): Promise<void> {
    if (!this.form.nombre.trim()) {
      return;
    }

    const dto = {
      nombre: this.form.nombre.trim(),
      descripcion: this.form.descripcion.trim() || null,
    };
    const id = this.editingId();

    try {
      if (id) {
        await this.categoriasStore.actualizar(id, dto);
      } else {
        await this.categoriasStore.crear(dto);
      }
      this.cancelar();
    } catch {
      this.error.set('No se pudo guardar la categoría.');
    }
  }

  editar(categoria: Categoria): void {
    this.editingId.set(categoria.id);
    this.form = {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? '',
    };
  }

  cancelar(): void {
    this.editingId.set(null);
    this.form = { ...FORM_VACIO };
  }

  async eliminar(categoria: Categoria): Promise<void> {
    if (!confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) {
      return;
    }

    try {
      await this.categoriasStore.eliminar(categoria.id);
    } catch {
      this.error.set('No se pudo eliminar (¿tiene productos asociados?).');
    }
  }
}
