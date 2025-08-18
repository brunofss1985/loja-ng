// src/app/pages/public/cart-component/cart-component.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/core/models/cart-item.model';
import { CartService } from 'src/app/core/services/cartService/cart-service.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart-component.component.html',
  styleUrls: ['./cart-component.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  couponCode: string = '';

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
    });
  }

  get subtotal(): number {
    return this.cartService.getSubtotal();
  }

  get shippingCost(): number {
    return this.cartService.getShipping();
  }

  get appliedDiscount(): number {
    return this.cartService.getDiscount();
  }

  get total(): number {
    return this.cartService.getTotal();
  }

  increaseQuantity(itemId: number): void {
    const item = this.cartItems.find((i) => i.id === itemId);
    if (item) this.cartService.updateQuantity(itemId, item.quantity + 1);
  }

  decreaseQuantity(itemId: number): void {
    const item = this.cartItems.find((i) => i.id === itemId);
    if (item && item.quantity > 1)
      this.cartService.updateQuantity(itemId, item.quantity - 1);
  }

  updateQuantity(itemId: number, event: any): void {
    const quantity = parseInt(event.target.value, 10);
    if (quantity >= 1) this.cartService.updateQuantity(itemId, quantity);
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId);
  }

  applyCoupon(): void {
    const code = (this.couponCode || '').toUpperCase();
    if (this.cartService.applyCoupon(code)) {
      alert(`Cupom aplicado!`);
    } else {
      alert('Cupom inválido. Tente: PRIMEIRA10 ou SUPLEMENTO15');
    }
    this.couponCode = '';
  }

  formatPrice(price: number): string {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }

  goToProducts(): void {
    this.router.navigate(['/produtos']);
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    this.router.navigate(['/payment']);
  }
}