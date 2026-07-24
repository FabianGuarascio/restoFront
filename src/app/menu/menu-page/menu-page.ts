import { Component } from '@angular/core';
import { Categorias } from '../categorias/categorias';
import { Productos } from '../productos/productos';

@Component({
  selector: 'app-menu-page',
  imports: [Categorias, Productos],
  templateUrl: './menu-page.html'
})
export class MenuPage {}
