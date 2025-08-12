import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Order } from '../../models/order.model ';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  // ✅ Busca o último pedido do usuário
  getLastOrder(userId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/user/${userId}`);
  }
}
