import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from 'src/app/core/models/cart-item.model';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.scss']
})
export class PaymentResultComponent implements OnInit {
  orderId: string = '';
  fullName: string = 'Cliente';
  orderSummary = {
    items: [] as CartItem[],
    total: 0
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] || '000000';
    });

    // Simulação de dados — substitua com dados reais se necessário
    this.fullName = 'Bruno';
    this.orderSummary = {
      items: [
      ],
      total: 309.70
    };
  }

  formatPrice(price: number): string {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }

  goToTracking(): void {
    this.router.navigate(['/rastreamento'], { queryParams: { orderId: this.orderId } });
  }

  goToStore(): void {
    this.router.navigate(['/produtos']);
  }
}
