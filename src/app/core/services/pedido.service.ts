import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import {
  Pedido,
  PedidoEstado,
  PedidoItemCreate,
  PedidoResumen,
} from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/pedidos`;

  getAll() {
    return this.http.get<PedidoResumen[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Pedido>(`${this.baseUrl}/${id}`);
  }

  crear(mesaId: number) {
    return this.http.post<Pedido>(this.baseUrl, { mesaId });
  }

  agregarItem(pedidoId: number, item: PedidoItemCreate) {
    return this.http.post<Pedido>(`${this.baseUrl}/${pedidoId}/items`, item);
  }

  quitarItem(pedidoId: number, itemId: number) {
    return this.http.delete<Pedido>(
      `${this.baseUrl}/${pedidoId}/items/${itemId}`,
    );
  }

  cambiarEstado(pedidoId: number, nuevoEstado: PedidoEstado) {
    return this.http.patch<Pedido>(`${this.baseUrl}/${pedidoId}/estado`, {
      nuevoEstado,
    });
  }
}
