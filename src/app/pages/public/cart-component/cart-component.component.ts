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
  appliedDiscount: number = 0;
  shippingCost: number = 0;

  private validCoupons: { [key: string]: number } = {
    PRIMEIRA10: 0.1,
    SUPLEMENTO15: 15.0,
    FRETE20: 0.2,
  };

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      // se remover o último item, zera desconto
      if (this.cartItems.length === 0) this.appliedDiscount = 0;
    });
  }

  get subtotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  get total(): number {
    return this.subtotal + this.shippingCost - this.appliedDiscount;
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
    if (this.validCoupons[code]) {
      this.appliedDiscount = this.subtotal * this.validCoupons[code];
      const discountPercent = this.validCoupons[code] * 100;
      alert(`Cupom aplicado! Desconto de ${discountPercent}%`);
      this.couponCode = '';
    } else {
      alert('Cupom inválido. Tente: PRIMEIRA10, SUPLEMENTO15 ou FRETE20');
    }
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
