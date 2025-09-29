import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
})
export class OrderStatusComponent implements OnInit {
  @Input() status!: string;
  statusLabel = '';
  statusClass = '';

  ngOnInit() {
    const map: Record<string, { label: string; class: string }> = {
      CREATED: { label: 'Criado', class: 'status-created' },
      PENDING: { label: 'Pendente', class: 'status-pending' },
      PAID: { label: 'Pago', class: 'status-paid' },
      CANCELED: { label: 'Cancelado', class: 'status-canceled' },
      PROCESSING: { label: 'Processando', class: 'status-processing' },
      SHIPPED: { label: 'Enviado', class: 'status-shipped' },
      DELIVERED: { label: 'Entregue', class: 'status-delivered' },
    };

    const fallback = { label: 'Desconhecido', class: 'status-created' };
    const statusInfo = map[this.status?.toUpperCase()] || fallback;

    this.statusLabel = statusInfo.label;
    this.statusClass = statusInfo.class;
  }
}
