import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '@core/services/producto.service';
import { CategoriaService } from '@core/services/categoria.service';
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
  private readonly productoService = inject(ProductoService);
  private readonly categoriaService = inject(CategoriaService);

  readonly productos = signal<Producto[]>([]);
  readonly categorias = this.categoriaService.categorias;
  readonly editingId = signal<number | null>(null);
  readonly error = signal<string | null>(null);
  form: ProductoForm = { ...FORM_VACIO };

  ngOnInit(): void {
    this.categoriaService.cargar();
    this.cargar();
  }

  cargar(): void {
    this.productoService.getAll().subscribe({
      next: (data) => this.productos.set(data),
      error: () => this.error.set('No se pudieron cargar los productos.'),
    });
  }

  guardar(): void {
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
    const onSuccess = () => {
      this.cancelar();
      this.cargar();
    };
    const onError = () => this.error.set('No se pudo guardar el producto.');

    if (id) {
      this.productoService
        .update(id, dto)
        .subscribe({ next: onSuccess, error: onError });
    } else {
      this.productoService
        .create(dto)
        .subscribe({ next: onSuccess, error: onError });
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

  eliminar(producto: Producto): void {
    if (!confirm(`¿Eliminar el producto "${producto.nombre}"?`)) {
      return;
    }

    this.productoService.delete(producto.id).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('No se pudo eliminar el producto.'),
    });
  }
}
