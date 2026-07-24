import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import {
  Producto,
  ProductoCreate,
  ProductoUpdate,
} from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoAPI {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/productos`;

  getAll(categoriaId?: number) {
    const url = categoriaId
      ? `${this.baseUrl}?categoriaId=${categoriaId}`
      : this.baseUrl;
    return this.http.get<Producto[]>(url);
  }

  create(dto: ProductoCreate) {
    return this.http.post<Producto>(this.baseUrl, dto);
  }

  update(id: number, dto: ProductoUpdate) {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
