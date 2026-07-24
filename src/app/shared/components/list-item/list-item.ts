import { Component, output } from '@angular/core';

@Component({
  selector: 'app-list-item',
  imports: [],
  template: `
    <li class="flex items-center justify-between py-2">
      <ng-content></ng-content>
      <div class="flex gap-2 text-sm">
        <button
          (click)="editar.emit()"
          class="cursor-pointer text-blue-600 hover:underline"
        >
          Editar
        </button>
        <button
          (click)="eliminar.emit()"
          class="cursor-pointer text-red-600 hover:underline"
        >
          Eliminar
        </button>
      </div>
    </li>
  `,
})
export class ListItem {
  readonly editar = output<void>();
  readonly eliminar = output<void>();
}
