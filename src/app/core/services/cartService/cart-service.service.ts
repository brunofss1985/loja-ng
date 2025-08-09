// src/app/core/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';

const STORAGE_KEY = 'cart_items';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.load());
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {}

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
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
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // Persistência simples no localStorage
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
