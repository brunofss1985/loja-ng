import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  icon: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart-component.component.html',
  styleUrls: ['./cart-component.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Whey Protein Concentrado',
      description: 'Sabor Chocolate - 900g',
      price: 89.90,
      quantity: 2,
      icon: '🥤'
    },
    {
      id: 2,
      name: 'Creatina Monohidratada',
      description: '300g - Pura',
      price: 45.90,
      quantity: 1,
      icon: '💊'
    },
    {
      id: 3,
      name: 'Termogênico Extreme',
      description: '60 cápsulas',
      price: 67.90,
      quantity: 1,
      icon: '🔥'
    }
  ];

  couponCode: string = '';
  appliedDiscount: number = 0;
  shippingCost: number = 15.90;

  private validCoupons: { [key: string]: number } = {
    'PRIMEIRA10': 0.10,
    'SUPLEMENTO15': 0.15,
    'FRETE20': 0.20
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Aqui você pode carregar os itens do carrinho de um serviço
    // this.loadCartItems();
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get total(): number {
    return this.subtotal + this.shippingCost - this.appliedDiscount;
  }

  increaseQuantity(itemId: number): void {
    const item = this.cartItems.find(item => item.id === itemId);
    if (item) {
      item.quantity++;
    }
  }

  decreaseQuantity(itemId: number): void {
    const item = this.cartItems.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      item.quantity--;
    }
  }

  updateQuantity(itemId: number, event: any): void {
    const quantity = parseInt(event.target.value);
    if (quantity >= 1) {
      const item = this.cartItems.find(item => item.id === itemId);
      if (item) {
        item.quantity = quantity;
      }
    }
  }

  removeItem(itemId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    // Reset discount if cart becomes empty
    if (this.cartItems.length === 0) {
      this.appliedDiscount = 0;
    }
  }

  applyCoupon(): void {
    const code = this.couponCode.toUpperCase();
    
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
    // ou simplesmente: alert('Redirecionando para produtos...');
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {

      alert('Seu carrinho está vazio!');
      
      return;
    }
    
    // Navegar para checkout ou processar pedido
    this.router.navigate(['/payment']);
    // ou: alert(`Redirecionando para checkout... Total: ${this.formatPrice(this.total)}`);
  }

  // Método para carregar itens do carrinho (conectar com seu serviço)
  private loadCartItems(): void {
    // Exemplo de como você pode integrar com um serviço:
    // this.cartService.getCartItems().subscribe(items => {
    //   this.cartItems = items;
    // });
  }
}