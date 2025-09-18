// admin-pedido-detalhes.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/core/services/orderService/order-service';
import { Order } from 'src/app/core/models/order.model ';
import { OrderStatusHistory } from 'src/app/core/models/order-status-history.model';

@Component({
  selector: 'app-admin-pedido-detalhes',
  templateUrl: './admin-pedido-detalhes.component.html',
  styleUrls: ['./admin-pedido-detalhes.component.scss']
})
export class AdminPedidoDetalhesComponent implements OnInit {
  order: Order | null = null;
  statusHistory: OrderStatusHistory[] = [];
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    const orderIdParam = this.route.snapshot.paramMap.get('id');
    if (orderIdParam) {
      const orderId = Number(orderIdParam);
      this.orderService.getOrderById(orderId).subscribe({
        next: ord => this.order = ord,
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
