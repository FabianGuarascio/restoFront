export type MesaEstado = 'Libre' | 'Ocupada' | 'Reservada';

export interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  estado: MesaEstado;
}

export interface MesaCreate {
  numero: number;
  capacidad: number;
}

export interface MesaUpdate {
  numero: number;
  capacidad: number;
  estado: MesaEstado;
}
