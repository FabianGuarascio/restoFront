export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  disponible: boolean;
  categoriaId: number;
  categoriaNombre?: string | null;
}

export interface ProductoCreate {
  nombre: string;
  descripcion?: string | null;
  precio: number;
  categoriaId: number;
  disponible?: boolean;
}

export interface ProductoUpdate {
  nombre: string;
  descripcion?: string | null;
  precio: number;
  categoriaId: number;
  disponible: boolean;
}
