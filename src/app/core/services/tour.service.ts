import { Injectable } from '@angular/core';
import { driver } from 'driver.js';

@Injectable({ providedIn: 'root' })
export class TourService {
  iniciar(onCerrar: () => void): void {
    const instancia = driver({
      showProgress: true,
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: 'Listo',
      onDestroyStarted: () => {
        instancia.destroy();
        onCerrar();
      },
      steps: [
        {
          popover: {
            title: '¡Bienvenido a RestoAdmin!',
            description: 'Te mostramos rápido cómo moverte por la app.',
          },
        },
        {
          element: '[data-tour="nav-pedidos"]',
          popover: {
            title: 'Pedidos',
            description:
              'Acá ves todos los pedidos, filtrás por estado y armás el pedido.',
          },
        },
        {
          element: '[data-tour="nav-mesas"]',
          popover: {
            title: 'Mesas',
            description:
              'Acá creás mesas nuevas, las reservás y controlás si están libres u ocupadas.',
          },
        },
        {
          element: '[data-tour="nav-menu"]',
          popover: {
            title: 'Menú',
            description:
              'Acá cargás las categorías y productos que después vas a poder agregar a un pedido.',
          },
        },
        {
          element: '[data-tour="crear-pedido"]',
          popover: {
            title: 'Crear un pedido',
            description:
              'Con este botón abrís el formulario para armar un pedido nuevo, eligiendo la mesa y agregando productos.',
          },
        },
      ],
    });
    instancia.drive();
  }
}
