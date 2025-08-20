import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/core/services/orderService/order-service';
import { AuthService } from 'src/app/core/services/authService/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/core/models/order.model ';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.scss'],
})
export class PaymentResultComponent implements OnInit {
  orders: Order[] = [];
  lastOrder?: Order;
  showAll: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (!user?.email) {
      this.toast.error('Usuário não autenticado.');
      return;
    }

    this.loadOrders(user.email);
  }

  private loadOrders(email: string): void {
    this.orderService.getAllOrders(email).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.lastOrder = orders?.[0] ?? undefined;
      },
      error: () => {
        this.toast.error('Erro ao carregar pedidos.');
      },
    });
  }

  goToTracking(): void {
    // lógica para redirecionar ou abrir rastreio
    this.toast.info('Funcionalidade de rastreio em desenvolvimento.');
  }

  goToStore(): void {
    // lógica para voltar à loja ou página inicial
    window.location.href = '/';
  }

  shareOnWhatsApp(): void {
    if (!this.lastOrder) return;

    const message = `Acabei de fazer um pedido na loja! Pedido #${this.lastOrder.id} com total de R$ ${this.lastOrder.total}. Confira você também!`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}
