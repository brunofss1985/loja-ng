import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/core/models/order.model ';
import { OrderService, OrderStatusHistory } from 'src/app/core/services/orderService/order-service';
import { AuthService } from 'src/app/core/services/authService/auth.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-user-pedido-detalhes',
  templateUrl: './user-pedido-detalhes.component.html',
  styleUrls: ['./user-pedido-detalhes.component.scss']
})
export class UserPedidoDetalhesComponent implements OnInit, OnDestroy {
  order: Order | null = null;
  statusHistory: OrderStatusHistory[] = [];
  errorMessage: string = '';
  pollingSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const orderIdParam = this.route.snapshot.paramMap.get('id');
    const user = this.authService.getUser();
    if (!user || !user.email) {
      this.errorMessage = 'Usuário não autenticado';
      return;
    }
    if (orderIdParam) {
      const orderId = Number(orderIdParam);
      this.loadOrder(orderId, user.email);

      // ⏱️ Polling a cada 5s
      this.pollingSub = interval(5000).subscribe(() => {
        this.loadOrder(orderId, user.email, true);
      });
    } else {
      this.errorMessage = 'ID do pedido inválido';
    }
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }

  loadOrder(orderId: number, email: string, isPolling: boolean = false): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: ord => {
        if (ord.customer?.email !== email) {
          this.errorMessage = 'Você não tem permissão para ver este pedido';
          return;
        }

        if (!this.order || this.order.status !== ord.status) {
          this.order = ord;

          this.orderService.getOrderStatusHistory(orderId).subscribe({
            next: hist => this.statusHistory = hist,
            error: err => console.warn('Erro ao buscar histórico: ' + err.message)
          });
        }
      },
      error: err => {
        if (!isPolling) {
          this.errorMessage = 'Erro ao buscar pedido: ' + err.message;
        }
      }
    });
  }
}
