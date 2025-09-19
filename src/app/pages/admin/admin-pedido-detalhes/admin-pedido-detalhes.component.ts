import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, OrderStatusHistory } from 'src/app/core/services/orderService/order-service';
import { Order } from 'src/app/core/models/order.model ';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-pedido-detalhes',
  templateUrl: './admin-pedido-detalhes.component.html',
  styleUrls: ['./admin-pedido-detalhes.component.scss']
})
export class AdminPedidoDetalhesComponent implements OnInit, OnDestroy {
  order: Order | null = null;
  statusHistory: OrderStatusHistory[] = [];
  errorMessage: string = '';
  pollingSub: Subscription | null = null;

  mapaStatus: { [key: string]: string } = {
    'CREATED': 'status-created',
    'PAID': 'status-paid',
    'CANCELED': 'status-canceled'
  };

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const orderIdParam = this.route.snapshot.paramMap.get('id');
    if (orderIdParam) {
      const orderId = Number(orderIdParam);
      this.loadOrder(orderId);

      // ⏱️ Inicia o polling
      this.pollingSub = interval(5000).subscribe(() => {
        this.loadOrder(orderId, true); // true = modo polling
      });
    } else {
      this.errorMessage = 'ID do pedido inválido';
    }
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }

  loadOrder(orderId: number, isPolling: boolean = false): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: ord => {
        if (!this.order || this.order.status !== ord.status) {
          this.order = ord;

          // Recarrega histórico apenas se status mudou
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

  voltar(): void {
    this.router.navigate(['/admin/pedidos']);
  }
}
