import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriasStore } from '@core/state/categorias.store';
import { ProductosStore } from '@core/state/productos.store';
import { Categoria } from '@core/models/categoria.model';
import { Producto } from '@core/models/producto.model';
import { Modal } from '@shared/components/modal/modal';

interface FormularioState {
  nombre: string;
  descripcion: string;
  precio: number | null;
  categoriaId: number | null;
  disponible: boolean;
}

const FORM_VACIO: FormularioState = {
  nombre: '',
  descripcion: '',
  precio: null,
  categoriaId: null,
  disponible: true,
};

@Component({
  selector: 'app-modal-formulario',
  imports: [FormsModule, Modal],
  templateUrl: './modal-formulario.html',
})
export class ModalFormulario {
  readonly categoriasStore = inject(CategoriasStore);
  private readonly productosStore = inject(ProductosStore);

  readonly tipo = input.required<'categoria' | 'producto'>();
  readonly abierto = input.required<boolean>();
  readonly item = input<Categoria | Producto | null>(null);
  readonly cerrar = output<void>();

  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  form: FormularioState = { ...FORM_VACIO };

  readonly titulo = computed(() => {
    const esEdicion = this.item() !== null;
    if (this.tipo() === 'categoria') {
      return esEdicion ? 'Editar categoría' : 'Nueva categoría';
    }
    return esEdicion ? 'Editar producto' : 'Nuevo producto';
  });

  constructor() {
    effect(() => {
      const item = this.item();
      this.abierto();
      this.error.set(null);

      if (!item) {
        this.form = { ...FORM_VACIO };
        return;
      }

      if (this.tipo() === 'categoria') {
        const categoria = item as Categoria;
        this.form = {
          ...FORM_VACIO,
          nombre: categoria.nombre,
          descripcion: categoria.descripcion ?? '',
        };
      } else {
        const producto = item as Producto;
        this.form = {
          nombre: producto.nombre,
          descripcion: producto.descripcion ?? '',
          precio: producto.precio,
          categoriaId: producto.categoriaId,
          disponible: producto.disponible,
        };
      }
    });
  }

  async guardar(): Promise<void> {
    if (this.tipo() === 'categoria') {
      await this.guardarCategoria();
    } else {
      await this.guardarProducto();
    }
  }

  private async guardarCategoria(): Promise<void> {
    if (!this.form.nombre.trim()) {
      return;
    }

    const dto = {
      nombre: this.form.nombre.trim(),
      descripcion: this.form.descripcion.trim() || null,
    };
    const item = this.item();

    this.guardando.set(true);
    try {
      if (item) {
        await this.categoriasStore.actualizar(item.id, dto);
      } else {
        await this.categoriasStore.crear(dto);
      }
      this.guardando.set(false);
      this.cerrar.emit();
    } catch {
      this.guardando.set(false);
      this.error.set('No se pudo guardar la categoría.');
    }
  }

  private async guardarProducto(): Promise<void> {
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
    const item = this.item();

    this.guardando.set(true);
    try {
      if (item) {
        await this.productosStore.actualizar(item.id, dto);
      } else {
        await this.productosStore.crear(dto);
      }
      this.guardando.set(false);
      this.cerrar.emit();
    } catch {
      this.guardando.set(false);
      this.error.set('No se pudo guardar el producto.');
    }
  }
}
