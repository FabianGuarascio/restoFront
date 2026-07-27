import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { PedidoAPI } from '@core/services/API/pedidoAPI';
import { MesaAPI } from '@core/services/API/mesaAPI';
import { PedidoResumen } from '@core/models/pedido.model';
import { PedidosPage } from './pedidos-page';

function crearResumen(overrides: Partial<PedidoResumen> = {}): PedidoResumen {
  return {
    id: 1,
    mesaId: 1,
    mesaNumero: 1,
    estado: 'Pendiente',
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    total: 0,
    ...overrides,
  };
}

describe('PedidosPage', () => {
  async function crearComponente(resumenes: PedidoResumen[]) {
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        { provide: PedidoAPI, useValue: { getAll: () => of(resumenes) } },
        { provide: MesaAPI, useValue: { getAll: () => of([]) } },
      ],
    });
    const fixture = TestBed.createComponent(PedidosPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('separa los pedidos en activos y finalizados según su estado', async () => {
    const comp = await crearComponente([
      crearResumen({ id: 1, estado: 'Pendiente' }),
      crearResumen({ id: 2, estado: 'Pagado' }),
      crearResumen({ id: 3, estado: 'Cancelado' }),
    ]);

    expect(comp.pedidosActivos().map((p) => p.id)).toEqual([1]);
    expect(
      comp
        .pedidosFinalizados()
        .map((p) => p.id)
        .sort(),
    ).toEqual([2, 3]);
  });

  it('toggleEstado agrega y quita estados del filtro', async () => {
    const comp = await crearComponente([]);

    comp.toggleEstado('Pendiente', false);
    expect(comp.estadosFiltrados().has('Pendiente')).toBe(false);

    comp.toggleEstado('Pendiente', true);
    expect(comp.estadosFiltrados().has('Pendiente')).toBe(true);
  });

  it('todosSeleccionados() es true cuando el filtro incluye todos los estados', async () => {
    const comp = await crearComponente([]);
    expect(comp.todosSeleccionados()).toBe(true);
  });

  it('algunoSeleccionado() es true con un filtro parcial', async () => {
    const comp = await crearComponente([]);

    comp.toggleEstado('Pendiente', false);

    expect(comp.algunoSeleccionado()).toBe(true);
    expect(comp.todosSeleccionados()).toBe(false);
  });

  it('toggleTodosLosEstados(false) vacía el filtro por completo', async () => {
    const comp = await crearComponente([]);

    comp.toggleTodosLosEstados(false);

    expect(comp.estadosFiltrados().size).toBe(0);
    expect(comp.algunoSeleccionado()).toBe(false);
  });
});
