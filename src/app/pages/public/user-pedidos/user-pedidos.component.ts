// user-pedidos.component.ts
import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/core/models/order.model ';
import { AuthService } from 'src/app/core/services/authService/auth.service';
import { OrderService } from 'src/app/core/services/orderService/order-service';

@Component({
  selector: 'app-user-pedidos',
  templateUrl: './user-pedidos.component.html',
  styleUrls: ['./user-pedidos.component.scss']
})
export class UserPedidosComponent implements OnInit {
  pedidos: Order[] = [];
  errorMessage: string = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.email) {
      this.orderService.getAllOrders(user.email).subscribe({
        next: orders => this.pedidos = orders,
        error: err => this.errorMessage = 'Erro ao carregar seus pedidos: ' + err.message
      });
    } else {
      this.errorMessage = 'Usuário não autenticado';
    }
  }

  verDetalhes(orderId: number): void {
    // Ex: router.navigate(['/pedido', orderId]);
  }
}
