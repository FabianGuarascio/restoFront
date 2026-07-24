import { Component, input, output } from '@angular/core';
import { Categoria } from '@core/models/categoria.model';
import { ListItem } from '@shared/components/list-item/list-item';

@Component({
  selector: 'app-categoria-item',
  imports: [ListItem],
  templateUrl: './categoria-item.html',
})
export class CategoriaItem {
  readonly categoria = input.required<Categoria>();

  readonly editar = output<Categoria>();
  readonly eliminar = output<Categoria>();
}
