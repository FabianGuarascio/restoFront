import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'pedidos', pathMatch: 'full' },
  {
    path: 'menu',
    loadComponent: () => import('./features/menu/menu-page/menu-page').then((m) => m.MenuPage),
  },
  {
    path: 'mesas',
    loadComponent: () => import('./features/mesas/mesas-page/mesas-page').then((m) => m.MesasPage),
  },
  {
    path: 'pedidos',
    loadComponent: () =>
      import('./features/pedidos/pedidos-page/pedidos-page').then((m) => m.PedidosPage),
  },
];
