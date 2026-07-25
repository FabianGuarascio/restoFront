import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CategoriasStore } from '@core/state/categorias.store';
import { ProductosStore } from '@core/state/productos.store';
import { MesasStore } from '@core/state/mesas.store';
import { Modal } from '@shared/components/modal/modal';

interface ItemEliminar {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-modal-eliminar',
  imports: [Modal],
  templateUrl: './modal-eliminar.html',
})
export class ModalEliminar {
  private readonly categoriasStore = inject(CategoriasStore);
  private readonly productosStore = inject(ProductosStore);
  private readonly mesasStore = inject(MesasStore);

  readonly tipo = input.required<'categoria' | 'producto' | 'mesa'>();
  readonly item = input<ItemEliminar | null>(null);
  readonly cerrar = output<void>();

  readonly eliminando = signal(false);
  readonly error = signal<string | null>(null);

  readonly abierto = computed(() => this.item() !== null);

  constructor() {
    effect(() => {
      this.item();
      this.error.set(null);
      this.eliminando.set(false);
    });
  }

  async confirmar(): Promise<void> {
    const item = this.item();
    if (!item) {
      return;
    }

    this.eliminando.set(true);
    this.error.set(null);

    try {
      if (this.tipo() === 'categoria') {
        await this.categoriasStore.eliminar(item.id);
      } else if (this.tipo() === 'producto') {
        await this.productosStore.eliminar(item.id);
      } else {
        await this.mesasStore.eliminar(item.id);
      }
      this.eliminando.set(false);
      this.cerrar.emit();
    } catch {
      this.eliminando.set(false);
      if (this.tipo() === 'categoria') {
        this.error.set('No se pudo eliminar (¿tiene productos asociados?).');
      } else if (this.tipo() === 'producto') {
        this.error.set('No se pudo eliminar el producto.');
      } else {
        this.error.set('No se pudo eliminar la mesa.');
      }
    }
  }
}
