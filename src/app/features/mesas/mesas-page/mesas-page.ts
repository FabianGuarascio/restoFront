import {
  Component,
  ElementRef,
  Injector,
  OnInit,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Mesa } from '@core/models/mesa.model';
import { MesasStore } from '@core/state/mesas.store';
import { MesaItem } from './mesa-item/mesa-item';
import { ModalCrearMesa } from './modal-crear-mesa/modal-crear-mesa';
import { ErrorBanner } from '@shared/components/error-banner/error-banner';
import { LoadingSpinner } from '@shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-mesas-page',
  imports: [MesaItem, ModalCrearMesa, DragDropModule, ErrorBanner, LoadingSpinner],
  templateUrl: './mesas-page.html',
})
export class MesasPage implements OnInit {
  private readonly mesasStore = inject(MesasStore);
  private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  readonly mesas = this.mesasStore.items;
  readonly errorCarga = this.mesasStore.error;
  readonly cargando = this.mesasStore.loading;
  readonly modalCreacionAbierto = signal(false);

  ngOnInit(): void {
    this.mesasStore.load();
  }

  reintentarCarga(): void {
    this.mesasStore.load(true);
  }

  onDrop(event: CdkDragDrop<Mesa[]>): void {
    const previousRects = this.capturarRects();

    const reordenadas = [...this.mesas()];
    moveItemInArray(reordenadas, event.previousIndex, event.currentIndex);
    const ids = reordenadas.map((m) => m.id);
    this.mesasStore.reordenar(ids);

    afterNextRender(() => this.animarReacomodo(previousRects), {
      injector: this.injector,
    });
  }

  private capturarRects(): Map<number, DOMRect> {
    const rects = new Map<number, DOMRect>();
    const nodos = this.elRef.nativeElement.querySelectorAll<HTMLElement>(
      '[data-mesa-id]',
    );
    nodos.forEach((nodo) => {
      const id = Number(nodo.dataset['mesaId']);
      rects.set(id, nodo.getBoundingClientRect());
    });
    return rects;
  }

  private animarReacomodo(previousRects: Map<number, DOMRect>): void {
    const nodos = this.elRef.nativeElement.querySelectorAll<HTMLElement>(
      '[data-mesa-id]',
    );

    nodos.forEach((nodo) => {
      const id = Number(nodo.dataset['mesaId']);
      const rectAnterior = previousRects.get(id);
      if (!rectAnterior) return;

      const rectNueva = nodo.getBoundingClientRect();
      const dx = rectAnterior.left - rectNueva.left;
      const dy = rectAnterior.top - rectNueva.top;

      if (dx === 0 && dy === 0) return;

      nodo.style.transition = 'none';
      nodo.style.transform = `translate(${dx}px, ${dy}px)`;

      nodo.getBoundingClientRect();

      nodo.style.transition = 'transform 250ms ease';
      nodo.style.transform = '';

      const limpiar = (evento: TransitionEvent) => {
        if (evento.propertyName !== 'transform') return;
        nodo.style.transition = '';
        nodo.style.transform = '';
        nodo.removeEventListener('transitionend', limpiar);
      };
      nodo.addEventListener('transitionend', limpiar);
    });
  }
}
