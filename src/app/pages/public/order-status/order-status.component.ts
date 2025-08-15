import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
})
export class OrderStatusComponent implements OnInit {
  @Input() status!: string;
  statusLabel = '';
  statusColor = '';

  ngOnInit() {
    const map: Record<string, { label: string; color: string }> = {
      CREATED: { label: 'Criado', color: 'text-neutral' },
      PENDING: { label: 'Aguardando pagamento', color: 'text-warning' },
      PAID: { label: 'Pagamento confirmado', color: 'text-success' },
      CANCELED: { label: 'Pedido cancelado', color: 'text-danger' },
      SENT: { label: 'Enviado', color: 'text-info' },
      DELIVERED: { label: 'Entregue', color: 'text-success' },
    };

    const fallback = { label: 'Desconhecido', color: 'text-neutral' };
    const statusInfo = map[this.status] || fallback;

    this.statusLabel = statusInfo.label;
    this.statusColor = statusInfo.color;
  }
}
