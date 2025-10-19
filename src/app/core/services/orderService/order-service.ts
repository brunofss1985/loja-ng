import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Order } from '../../models/order.model ';

export interface OrderStatusHistory {
  status: string;
  changedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  // ✅ Busca o último pedido do usuário
  getLastOrder(email: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/user/${encodeURIComponent(email)}`);
  }

  // ✅ Busca todos os pedidos do usuário
  getAllOrders(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${encodeURIComponent(email)}/all`);
  }

  // ✅ Busca todos os pedidos para o admin
  getAllOrdersForAdmin(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/all`);
  }

  // ✅ Busca pedido por ID
  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  // ✅ Busca histórico de status
  getOrderStatusHistory(orderId: number): Observable<OrderStatusHistory[]> {
    return this.http.get<OrderStatusHistory[]>(`${this.apiUrl}/${orderId}/status-history`);
  }

  // ✅ Finaliza venda (endpoint esperado no backend)
  finalizeOrder(orderId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${orderId}/finalize`, {});
  }
}
