import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '@core/services/categoria.service';
import { Categoria } from '@core/models/categoria.model';

interface CategoriaForm {
  nombre: string;
  descripcion: string;
}

const FORM_VACIO: CategoriaForm = { nombre: '', descripcion: '' };

@Component({
  selector: 'app-categorias',
  imports: [FormsModule],
  templateUrl: './categorias.html',
})
export class Categorias implements OnInit {
  private readonly categoriaService = inject(CategoriaService);

  readonly categorias = this.categoriaService.categorias;
  readonly editingId = signal<number | null>(null);
  readonly error = signal<string | null>(null);
  form: CategoriaForm = { ...FORM_VACIO };

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.categoriaService.cargar();
  }

  guardar(): void {
    if (!this.form.nombre.trim()) {
      return;
    }

    const dto = {
      nombre: this.form.nombre.trim(),
      descripcion: this.form.descripcion.trim() || null,
    };
    const id = this.editingId();
    const onSuccess = () => {
      this.cancelar();
      this.cargar();
    };
    const onError = () => this.error.set('No se pudo guardar la categoría.');

    if (id) {
      this.categoriaService.update(id, dto).subscribe({ next: onSuccess, error: onError });
    } else {
      this.categoriaService.create(dto).subscribe({ next: onSuccess, error: onError });
    }
  }

  editar(categoria: Categoria): void {
    this.editingId.set(categoria.id);
    this.form = { nombre: categoria.nombre, descripcion: categoria.descripcion ?? '' };
  }

  cancelar(): void {
    this.editingId.set(null);
    this.form = { ...FORM_VACIO };
  }

  eliminar(categoria: Categoria): void {
    if (!confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) {
      return;
    }

    this.categoriaService.delete(categoria.id).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('No se pudo eliminar (¿tiene productos asociados?).'),
    });
  }
}
