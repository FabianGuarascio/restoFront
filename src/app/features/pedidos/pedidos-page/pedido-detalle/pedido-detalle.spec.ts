import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PedidoAPI } from '@core/services/API/pedidoAPI';
import { ProductoAPI } from '@core/services/API/productoAPI';
import { MesaAPI } from '@core/services/API/mesaAPI';
import { Pedido, PedidoItem } from '@core/models/pedido.model';
import { PedidoDetalle } from './pedido-detalle';

function crearItem(overrides: Partial<PedidoItem> = {}): PedidoItem {
  return {
    id: 1,
    productoId: 1,
    productoNombre: 'Coca Cola',
    cantidad: 1,
    precioUnitario: 100,
    subtotal: 100,
    ...overrides,
  };
}

function crearPedido(overrides: Partial<Pedido> = {}): Pedido {
  return {
    id: 1,
    mesaId: 1,
    mesaNumero: 1,
    estado: 'Pendiente',
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    items: [],
    total: 0,
    ...overrides,
  };
}

describe('PedidoDetalle', () => {
  function crearComponente(pedido: Pedido) {
    TestBed.configureTestingModule({
      providers: [
        { provide: PedidoAPI, useValue: {} },
        { provide: ProductoAPI, useValue: { getAll: () => of([]) } },
        { provide: MesaAPI, useValue: {} },
      ],
    });
    const fixture = TestBed.createComponent(PedidoDetalle);
    fixture.componentRef.setInput('pedido', pedido);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('puedeModificarItems() es true en Pendiente', () => {
    const comp = crearComponente(crearPedido({ estado: 'Pendiente' }));
    expect(comp.puedeModificarItems()).toBe(true);
  });

  it('puedeModificarItems() es false en Pagado', () => {
    const comp = crearComponente(crearPedido({ estado: 'Pagado' }));
    expect(comp.puedeModificarItems()).toBe(false);
  });

  it('transicionesDisponibles() refleja las transiciones válidas del estado actual', () => {
    const comp = crearComponente(crearPedido({ estado: 'Pendiente' }));
    expect(comp.transicionesDisponibles()).toEqual(['EnPreparacion', 'Cancelado']);
  });

  it('bloqueaTransicion("EnPreparacion") es true si el pedido no tiene ítems', () => {
    const comp = crearComponente(crearPedido({ estado: 'Pendiente', items: [] }));
    expect(comp.bloqueaTransicion('EnPreparacion')).toBe(true);
  });

  it('bloqueaTransicion("EnPreparacion") es false si el pedido ya tiene ítems', () => {
    const comp = crearComponente(
      crearPedido({ estado: 'Pendiente', items: [crearItem()] }),
    );
    expect(comp.bloqueaTransicion('EnPreparacion')).toBe(false);
  });

  it('bloqueaTransicion("Cancelado") siempre es false, sin importar los ítems', () => {
    const comp = crearComponente(crearPedido({ estado: 'Pendiente', items: [] }));
    expect(comp.bloqueaTransicion('Cancelado')).toBe(false);
  });
});
