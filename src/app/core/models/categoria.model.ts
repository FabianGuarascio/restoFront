export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string | null;
}

export type CategoriaUpdate = CategoriaCreate;
