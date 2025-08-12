import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/core/models/order.model ';
import { OrderService } from 'src/app/core/services/orderService/order-service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  lastOrder?: Order;

  // ✅ controla a aba ativa
  activeTab: string = 'visao-geral';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    const userEmail = 'brunofss1985@gmail.com'; // Idealmente, pegue do AuthService
    this.orderService.getLastOrder(userEmail).subscribe(order => {
      this.lastOrder = order;
    });
  }

  // ✅ método para trocar de aba
  setTab(tabName: string): void {
    this.activeTab = tabName;
  }
}
