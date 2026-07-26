import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { guestGuard } from '@core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('@features/auth/login-page/login-page').then((m) => m.LoginPage),
  },
  { path: '', redirectTo: 'pedidos', pathMatch: 'full' },
  {
    path: 'menu',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@features/menu/menu-page/menu-page').then((m) => m.MenuPage),
  },
  {
    path: 'mesas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@features/mesas/mesas-page/mesas-page').then((m) => m.MesasPage),
  },
  {
    path: 'pedidos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@features/pedidos/pedidos-page/pedidos-page').then(
        (m) => m.PedidosPage,
      ),
  },
];
