import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosStore } from '@core/state/productos.store';
import { CategoriasStore } from '@core/state/categorias.store';
import { Producto } from '@core/models/producto.model';
import { ProductoItem } from './producto-item/producto-item';

interface ProductoForm {
  nombre: string;
  descripcion: string;
  precio: number | null;
  categoriaId: number | null;
  disponible: boolean;
}

const FORM_VACIO: ProductoForm = {
  nombre: '',
  descripcion: '',
  precio: null,
  categoriaId: null,
  disponible: true,
};

@Component({
  selector: 'app-productos',
  imports: [FormsModule, ProductoItem],
  templateUrl: './productos.html',
})
export class Productos implements OnInit {
  private readonly store = inject(ProductosStore);
  private readonly categoriasStore = inject(CategoriasStore);

  readonly productos = this.store.items;
  readonly categorias = this.categoriasStore.items;
  readonly editingId = signal<number | null>(null);
  readonly error = signal<string | null>(null);
  form: ProductoForm = { ...FORM_VACIO };

  ngOnInit(): void {
    this.categoriasStore.load();
    this.store.load();
  }

  async guardar(): Promise<void> {
    if (
      !this.form.nombre.trim() ||
      this.form.precio === null ||
      this.form.categoriaId === null
    ) {
      this.error.set('Completá nombre, precio y categoría.');
      return;
    }

    const dto = {
      nombre: this.form.nombre.trim(),
      descripcion: this.form.descripcion.trim() || null,
      precio: this.form.precio,
      categoriaId: this.form.categoriaId,
      disponible: this.form.disponible,
    };

    const id = this.editingId();

    try {
      if (id) {
        await this.store.actualizar(id, dto);
      } else {
        await this.store.crear(dto);
      }
      this.cancelar();
    } catch {
      this.error.set('No se pudo guardar el producto.');
    }
  }

  editar(producto: Producto): void {
    this.editingId.set(producto.id);
    this.form = {
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      precio: producto.precio,
      categoriaId: producto.categoriaId,
      disponible: producto.disponible,
    };
  }

  cancelar(): void {
    this.editingId.set(null);
    this.error.set(null);
    this.form = { ...FORM_VACIO };
  }

  async eliminar(producto: Producto): Promise<void> {
    if (!confirm(`¿Eliminar el producto "${producto.nombre}"?`)) {
      return;
    }

    try {
      await this.store.eliminar(producto.id);
    } catch {
      this.error.set('No se pudo eliminar el producto.');
    }
  }
}
