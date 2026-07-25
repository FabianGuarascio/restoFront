import { Component, OnInit, inject, signal } from '@angular/core';
import { ProductosStore } from '@core/state/productos.store';
import { CategoriasStore } from '@core/state/categorias.store';
import { Producto } from '@core/models/producto.model';
import { ProductoItem } from './producto-item/producto-item';
import { ModalFormulario } from '@shared/components/modal-formulario/modal-formulario';
import { ModalEliminar } from '@shared/components/modal-eliminar/modal-eliminar';

@Component({
  selector: 'app-productos',
  imports: [ProductoItem, ModalFormulario, ModalEliminar],
  templateUrl: './productos.html',
})
export class Productos implements OnInit {
  private readonly store = inject(ProductosStore);
  private readonly categoriasStore = inject(CategoriasStore);

  readonly productos = this.store.items;

  readonly itemEditando = signal<Producto | null>(null);
  readonly modalCreacionAbierto = signal(false);
  readonly itemAEliminar = signal<Producto | null>(null);

  ngOnInit(): void {
    this.categoriasStore.load();
    this.store.load();
  }

  nuevo(): void {
    this.itemEditando.set(null);
    this.modalCreacionAbierto.set(true);
  }

  editar(producto: Producto): void {
    this.itemEditando.set(producto);
    this.modalCreacionAbierto.set(true);
  }

  eliminar(producto: Producto): void {
    this.itemAEliminar.set(producto);
  }
}
