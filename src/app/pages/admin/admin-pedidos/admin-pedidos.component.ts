import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  columns: string[] = ['id', 'customer', 'status', 'total', 'createdAt'];
  columnLabels: { [key: string]: string } = {
    id: 'ID',
    customer: 'Cliente',
    status: 'Status',
    total: 'Total',
    createdAt: 'Data'
  };

  mapaStatus: { [key: string]: string } = {
    'CREATED': 'status-created',
    'PAID': 'status-paid',
    'CANCELED': 'status-canceled'
  };

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllOrders();
  }

  loadAllOrders(): void {
    this.orderService.getAllOrdersForAdmin().subscribe({
      next: orders => this.pedidos = orders,
      error: err => this.errorMessage = 'Erro ao carregar pedidos: ' + err.message
    });
  }

  verDetalhes(order: Order): void {
    this.router.navigate(['/admin/pedidos', order.id]);
  }

  formatarCelula(header: string, value: any): string {
    if (header === 'customer') {
      return `${value?.fullName} (${value?.email})`;
    }

    if (header === 'total') {
      return `R$ ${value.toFixed(2)}`;
    }

    if (header === 'createdAt') {
      return new Date(value).toLocaleString();
    }

    if (header === 'status') {
      return value;
    }

    return value;
  }
}
