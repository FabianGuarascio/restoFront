import { Component, input, output } from '@angular/core';
import { Producto } from '@core/models/producto.model';
import { ListItem } from '@shared/components/list-item/list-item';

@Component({
  selector: 'app-producto-item',
  imports: [ListItem],
  templateUrl: './producto-item.html',
})
export class ProductoItem {
  readonly producto = input.required<Producto>();
  readonly editar = output<Producto>();
  readonly eliminar = output<Producto>();
}
