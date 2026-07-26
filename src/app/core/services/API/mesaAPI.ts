import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { Mesa, MesaCreate, MesaUpdate } from '../../models/mesa.model';

@Injectable({ providedIn: 'root' })
export class MesaAPI {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/mesas`;

  getAll() {
    return this.http.get<Mesa[]>(this.baseUrl);
  }

  create(dto: MesaCreate) {
    return this.http.post<Mesa>(this.baseUrl, dto);
  }

  update(id: number, dto: MesaUpdate) {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  reordenar(ids: number[]) {
    return this.http.put<void>(`${this.baseUrl}/orden`, { ids });
  }
}
