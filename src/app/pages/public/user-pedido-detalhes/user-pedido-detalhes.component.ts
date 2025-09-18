// user-pedido-detalhes.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/core/models/order.model ';
import { OrderService } from 'src/app/core/services/orderService/order-service';
import { AuthService } from 'src/app/core/services/authService/auth.service';
import { OrderStatusHistory } from 'src/app/core/models/order-status-history.model';

@Component({
  selector: 'app-user-pedido-detalhes',
  templateUrl: './user-pedido-detalhes.component.html',
  styleUrls: ['./user-pedido-detalhes.component.scss']
})
export class UserPedidoDetalhesComponent implements OnInit {
  order: Order | null = null;
  statusHistory: OrderStatusHistory[] = [];
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const orderIdParam = this.route.snapshot.paramMap.get('id');
    const user = this.authService.getUser();
    if (!user || !user.email) {
      this.errorMessage = 'Usuário não autenticado';
      return;
    }
    if (orderIdParam) {
      const orderId = Number(orderIdParam);
      this.orderService.getOrderById(orderId).subscribe({
        next: ord => {
          // checar se é pedido do usuário
          if (ord.customer && ord.customer.email === user.email) {
            this.order = ord;
          } else {
            this.errorMessage = 'Você não tem permissão para ver este pedido';
          }
        },
        error: err => this.errorMessage = 'Erro ao buscar pedido: ' + err.message
      });
      this.orderService.getOrderStatusHistory(orderId).subscribe({
        next: hist => this.statusHistory = hist,
        error: err => console.warn('Erro ao buscar histórico: ' + err.message)
      });
    } else {
      this.errorMessage = 'ID do pedido inválido';
    }
  }
}
