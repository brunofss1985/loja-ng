import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, OrderStatusHistory } from 'src/app/core/services/orderService/order-service';
import { Order } from 'src/app/core/models/order.model ';
import { interval, Subscription } from 'rxjs';
import { VendasService } from 'src/app/core/services/vendasService/vendas.service';

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
  finalizando: boolean = false;

  mapaStatus: { [key: string]: string } = {
    'CREATED': 'status-created',
    'PAID': 'status-paid',
    'CANCELED': 'status-canceled',
    'DESPACHADO': 'status-despachado'
  };

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    private vendasService: VendasService
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

  // Exibe botão de finalizar quando pedido está pago ou já despachado (para finalizar itens restantes)
  isFinalizable(): boolean {
    const s = this.order?.status?.toString()?.trim()?.toUpperCase();
    return s === 'PAID' || s === 'DESPACHADO';
  }

  // Abre modal para ler código de barras e lote
  finalizeVenda(): void {
    if (!this.order || this.finalizando) return;
    const codigoBarras = window.prompt('Informe o código de barras do produto:');
    if (!codigoBarras) return;
    const loteCodigo = window.prompt('Informe o código do lote:');
    if (!loteCodigo) return;

    this.finalizando = true;
    this.vendasService.finalizar(this.order.id, codigoBarras.trim(), loteCodigo.trim()).subscribe({
      next: () => {
        this.loadOrder(this.order!.id);
        window.alert('Venda finalizada e produto removido do lote/estoque.');
      },
      error: (err: any) => {
        console.error('Erro ao finalizar venda:', err);
        window.alert((err?.error?.message) || 'Não foi possível finalizar a venda. Verifique o código e o lote.');
      },
      complete: () => this.finalizando = false
    });
  }
}
