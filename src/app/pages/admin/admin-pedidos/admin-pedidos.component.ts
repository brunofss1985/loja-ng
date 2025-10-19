import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/core/models/order.model ';
import { ProdutoVendidoDTO, VendasService } from 'src/app/core/services/vendasService/vendas.service';
import { OrderService } from 'src/app/core/services/orderService/order-service';

type PedidoItemRow = {
  orderId: number;
  produtoNome: string;
  produtoId?: number;
  quantidade: number;
  precoUnit: number;
  total: number;
  status: string;
  createdAt: string;
  cliente: string;
  finalizado: boolean; // se já existe ProdutoVendido para este produto neste pedido
};

@Component({
  selector: 'app-admin-pedidos',
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.scss']
})
export class AdminPedidosComponent implements OnInit {
  pedidos: Order[] = [];
  linhas: PedidoItemRow[] = [];
  errorMessage: string = '';

  columns: string[] = ['orderId', 'produtoNome', 'quantidade', 'precoUnit', 'total', 'status', 'createdAt', 'cliente', 'finalizado'];
  columnLabels: { [key: string]: string } = {
    orderId: 'Pedido',
    produtoNome: 'Produto',
    quantidade: 'Qtd',
    precoUnit: 'Preço',
    total: 'Total',
    status: 'Status',
    createdAt: 'Data',
    cliente: 'Cliente',
    finalizado: 'Finalizado?'
  };

  mapaStatus: { [key: string]: string } = {
    'CREATED': 'status-created',
    'PAID': 'status-paid',
    'CANCELED': 'status-canceled',
    'DESPACHADO': 'status-despachado'
  };

  constructor(private orderService: OrderService, private router: Router, private vendasService: VendasService) {}

  ngOnInit(): void {
    this.loadAllOrders();
  }

  loadAllOrders(): void {
    this.orderService.getAllOrdersForAdmin().subscribe({
      next: orders => {
        this.pedidos = orders;
        // Carrega lista de vendidos para marcar finalizados
        this.vendasService.listar().subscribe({
          next: vendidos => {
            this.linhas = this.flattenOrders(orders, vendidos);
          },
          error: err => {
            console.warn('Erro ao listar vendidos:', err);
            this.linhas = this.flattenOrders(orders, []);
          }
        });
      },
      error: err => this.errorMessage = 'Erro ao carregar pedidos: ' + err.message
    });
  }

  private flattenOrders(orders: Order[], vendidos: ProdutoVendidoDTO[]): PedidoItemRow[] {
    const vendidosKey = new Set(
      vendidos
        .filter(v => v.orderId && v.produtoId)
        .map(v => `${v.orderId}:${v.produtoId}`)
    );

    const rows: PedidoItemRow[] = [];
    for (const o of orders) {
      for (const it of o.items || []) {
        const key = `${o.id}:${it.productId ?? ''}`;
        const finalizado = it.productId ? vendidosKey.has(key) : false;
        rows.push({
          orderId: o.id,
          produtoNome: it.name,
          produtoId: it.productId,
          quantidade: it.quantity,
          precoUnit: it.price,
          total: it.price * it.quantity,
          status: o.status,
          createdAt: o.createdAt,
          cliente: `${o.customer?.fullName} (${o.customer?.email})`,
          finalizado,
        });
      }
    }
    return rows;
  }

  verDetalhes(row: PedidoItemRow | Order): void {
    // app-tables emite a linha completa; suportar ambos os casos por retrocompatibilidade
    const id = (row as any).orderId ?? (row as any).id;
    this.router.navigate(['/admin/pedidos', id]);
  }

  formatarCelula(header: string, value: any): string {
    if (header === 'precoUnit' || header === 'total') {
      const num = Number(value || 0);
      return `R$ ${num.toFixed(2)}`;
    }
    if (header === 'createdAt') {
      return new Date(value).toLocaleString();
    }
    if (header === 'finalizado') {
      return value ? 'Sim' : 'Não';
    }
    return String(value);
  }
}
