export type PedidoEstado =
  'Pendiente' | 'EnPreparacion' | 'Listo' | 'Entregado' | 'Pagado' | 'Cancelado';

export interface PedidoItem {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  notas?: string | null;
  subtotal: number;
}

export interface Pedido {
  id: number;
  mesaId: number;
  mesaNumero: number;
  estado: PedidoEstado;
  fechaCreacion: string;
  items: PedidoItem[];
  total: number;
}

export interface PedidoResumen {
  id: number;
  mesaId: number;
  mesaNumero: number;
  estado: PedidoEstado;
  fechaCreacion: string;
  total: number;
}

export interface PedidoItemCreate {
  productoId: number;
  cantidad: number;
  notas?: string | null;
}

export const PEDIDO_TRANSICIONES_VALIDAS: Record<PedidoEstado, PedidoEstado[]> = {
  Pendiente: ['EnPreparacion', 'Cancelado'],
  EnPreparacion: ['Listo', 'Cancelado'],
  Listo: ['Entregado', 'Cancelado'],
  Entregado: ['Pagado'],
  Pagado: [],
  Cancelado: [],
};
