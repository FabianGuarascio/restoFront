import { Component, OnInit, inject, signal } from '@angular/core';
import { CategoriasStore } from '@core/state/categorias.store';
import { Categoria } from '@core/models/categoria.model';
import { CategoriaItem } from './categoria-item/categoria-item';
import { ModalFormulario } from '@shared/components/modal-formulario/modal-formulario';
import { ModalEliminar } from '@shared/components/modal-eliminar/modal-eliminar';
import { ErrorBanner } from '@shared/components/error-banner/error-banner';
import { LoadingSpinner } from '@shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-categorias',
  imports: [CategoriaItem, ModalFormulario, ModalEliminar, ErrorBanner, LoadingSpinner],
  templateUrl: './categorias.html',
})
export class Categorias implements OnInit {
  private readonly categoriasStore = inject(CategoriasStore);

  readonly categorias = this.categoriasStore.items;
  readonly errorCarga = this.categoriasStore.error;
  readonly cargando = this.categoriasStore.loading;

  readonly itemEditando = signal<Categoria | null>(null);
  readonly modalCreacionAbierto = signal(false);
  readonly itemAEliminar = signal<Categoria | null>(null);

  ngOnInit(): void {
    this.categoriasStore.load();
  }

  reintentarCarga(): void {
    this.categoriasStore.load(true);
  }

  nueva(): void {
    this.itemEditando.set(null);
    this.modalCreacionAbierto.set(true);
  }

  editar(categoria: Categoria): void {
    this.itemEditando.set(categoria);
    this.modalCreacionAbierto.set(true);
  }

  eliminar(categoria: Categoria): void {
    this.itemAEliminar.set(categoria);
  }
}
