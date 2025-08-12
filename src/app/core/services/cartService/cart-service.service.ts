import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';

const STORAGE_KEY = 'cart_items';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.load());
  public cartItems$ = this.cartItemsSubject.asObservable();

  private appliedDiscount = 0;
  private shippingCost = 0;

  constructor() {}

  // 📦 Carrinho
  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  getCartItemsSnapshot(): CartItem[] {
    return [...this.cartItemsSubject.value];
  }

  addToCart(item: CartItem): void {
    const currentItems = [...this.cartItemsSubject.value];
    const existing = currentItems.find(ci => ci.id === item.id);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      currentItems.push(item);
    }
    this.set(currentItems);
  }

  removeFromCart(itemId: number): void {
    const updated = this.cartItemsSubject.value.filter(i => i.id !== itemId);
    this.set(updated);
    if (updated.length === 0) this.appliedDiscount = 0;
  }

  updateQuantity(itemId: number, quantity: number): void {
    if (quantity < 1) return;
    const updated = this.cartItemsSubject.value.map(i =>
      i.id === itemId ? { ...i, quantity } : i
    );
    this.set(updated);
  }

  clearCart(): void {
    this.set([]);
    this.appliedDiscount = 0;
  }

  // 💰 Valores
  getSubtotal(): number {
    return this.cartItemsSubject.value.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getShipping(): number {
    return this.shippingCost;
  }

  getDiscount(): number {
    return this.appliedDiscount;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShipping() - this.getDiscount();
  }

  // 🎟️ Cupom
  applyCoupon(code: string): boolean {
    const validCoupons: { [key: string]: number } = {
      'PRIMEIRA10': 0.10,
      'SUPLEMENTO15': 0.15,
      'FRETE20': 0.20
    };

    const upperCode = code.toUpperCase();
    if (validCoupons[upperCode]) {
      this.appliedDiscount = this.getSubtotal() * validCoupons[upperCode];
      return true;
    }
    return false;
  }

  // 🧠 Persistência
  private set(items: CartItem[]) {
    this.cartItemsSubject.next(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
