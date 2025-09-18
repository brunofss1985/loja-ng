// admin-pedidos.component.ts
import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/core/models/order.model ';
import { OrderService } from 'src/app/core/services/orderService/order-service';

@Component({
  selector: 'app-admin-pedidos',
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.scss']
})
export class AdminPedidosComponent implements OnInit {
  pedidos: Order[] = [];
  errorMessage: string = '';

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadAllOrders();
  }

  loadAllOrders(): void {
    // Supondo que exista um endpoint /orders/all que o backend precisa ter
    this.orderService.getAllOrdersForAdmin().subscribe({
      next: orders => this.pedidos = orders,
      error: err => this.errorMessage = 'Erro ao carregar pedidos: ' + err.message
    });
  }

  verDetalhes(orderId: number): void {
    // redireciona para página de detalhes do admin
    // Ex: router.navigate(['/admin/pedidos', orderId]);
  }
}
