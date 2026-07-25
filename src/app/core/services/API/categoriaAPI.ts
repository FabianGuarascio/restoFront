import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import {
  Categoria,
  CategoriaCreate,
  CategoriaUpdate,
} from '../../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaAPI {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/categorias`;

  getAll() {
    return this.http.get<Categoria[]>(this.baseUrl);
  }

  create(dto: CategoriaCreate) {
    return this.http.post<Categoria>(this.baseUrl, dto);
  }

  update(id: number, dto: CategoriaUpdate) {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
