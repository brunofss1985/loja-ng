import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { CartItem } from '../../models/cart-item.model';
import { AuthService } from '../authService/auth.service';

const STORAGE_KEY = 'cart_items';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private appliedDiscount = 0;
  private shippingCost = 0;
  private readonly API_URL = 'http://localhost:8080/api/cart';
  private currentSessionId: string | null = null;
  private currentUserId: string | null = null;
  private backendEnabled = true;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.initializeCart();
    this.setupAuthListeners();
  }

  // 🎧 Escuta eventos de autenticação
  private setupAuthListeners(): void {
    window.addEventListener('auth:login', () => {
      console.log('🎧 Evento auth:login recebido');
      setTimeout(() => this.syncCartOnLogin(), 300);
    });

    window.addEventListener('auth:logout', () => {
      console.log('🎧 Evento auth:logout recebido');
      this.clearCartOnLogout();
    });
  }

  // 🚀 Inicialização do carrinho
  private initializeCart(): void {
    if (this.authService.isAuthenticated()) {
      const sessionId = this.authService.getSessionId();
      const user = this.authService.getUser();

      this.currentSessionId = sessionId;
      this.currentUserId = user?.email || user?.id;

      if (this.currentSessionId && this.currentUserId) {
        console.log('🔑 Usuário logado:', {
          sessionId: this.currentSessionId,
          userId: this.currentUserId,
        });

        setTimeout(() => {
          this.loadCartFromBackend().subscribe();
        }, 100);
      } else {
        console.warn('⚠️ Dados de autenticação incompletos');
        this.loadCartFromStorage();
      }
    } else {
      console.log('👤 Usuário deslogado - usando localStorage');
      this.currentSessionId = null;
      this.currentUserId = null;
      this.loadCartFromStorage();
    }
  }

  // 🔄 Sincronização no login
  public syncCartOnLogin(): void {
    const sessionId = this.authService.getSessionId();
    const user = this.authService.getUser();
    const userId = user?.email || user?.id;

    if (!sessionId || !userId) {
      console.warn('⚠️ Login sem dados válidos:', { sessionId, userId });
      return;
    }

    console.log('🔄 Sincronizando carrinho para:', userId);

    if (
      (this.currentSessionId && this.currentSessionId !== sessionId) ||
      (this.currentUserId && this.currentUserId !== userId)
    ) {
      console.log('🔄 Usuário diferente, limpando carrinho');
      this.cartItemsSubject.next([]);
    }

    this.currentSessionId = sessionId;
    this.currentUserId = userId;

    const localItems = this.getLocalStorageItems();

    if (localItems.length > 0) {
      console.log('📦 Mesclando', localItems.length, 'itens do localStorage');
      this.loadCartFromBackend().subscribe(() => {
        const backendItems = this.getCartItemsSnapshot();
        const mergedItems = this.mergeCartItems(localItems, backendItems);
        this.updateCartInBackend(mergedItems);
        this.clearStorage();
      });
    } else {
      console.log('📦 Carregando carrinho do backend');
      this.loadCartFromBackend().subscribe();
    }
  }

  // 🔄 Limpeza no logout
  public clearCartOnLogout(): void {
    console.log('🚪 LOGOUT: Limpando carrinho completamente');

    this.currentSessionId = null;
    this.currentUserId = null;
    this.cartItemsSubject.next([]);
    this.appliedDiscount = 0;
    this.shippingCost = 0;
    this.clearStorage();

    console.log('✅ Carrinho limpo - deve ficar vazio até próximo login');
  }

  // 📦 OPERAÇÕES DO CARRINHO

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  getCartItemsSnapshot(): CartItem[] {
    return [...this.cartItemsSubject.value];
  }

  addToCart(item: CartItem): void {
    const currentItems = [...this.cartItemsSubject.value];
    const existing = currentItems.find((ci) => ci.id === item.id);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      currentItems.push(item);
    }

    this.updateCart(currentItems);
  }

  removeFromCart(itemId: number): void {
    const updated = this.cartItemsSubject.value.filter((i) => i.id !== itemId);
    this.updateCart(updated);
  }

  updateQuantity(itemId: number, quantity: number): void {
    if (quantity < 1) return;
    const updated = this.cartItemsSubject.value.map((i) =>
      i.id === itemId ? { ...i, quantity } : i
    );
    this.updateCart(updated);
  }

  clearCart(): void {
    this.updateCart([]);
    this.appliedDiscount = 0;
  }

  /**
   * ✅ ADICIONADO: Limpa o carrinho no backend de forma robusta.
   * Se o carrinho não existir, a API retorna 404 e o método retorna `of(null)` sem erro.
   */
  clearCartBack(userId: string): Observable<void> {
    if (!userId) {
      console.error('❌ Falha ao limpar carrinho no backend: userId inválido.');
      return of(undefined);
    }

    return this.http.delete<void>(`${this.API_URL}/${userId}`).pipe(
      tap(() => console.log(`✅ Carrinho do usuário ${userId} limpo no backend.`)),
      catchError((error) => {
        if (error.status === 404) {
          console.warn(
            `⚠️ Carrinho para o usuário ${userId} não encontrado no backend (OK).`
          );
          // Retornamos um Observable de sucesso para que a cadeia de chamadas continue
          return of(undefined);
        } else {
          console.error(
            `❌ Erro ao limpar carrinho do usuário ${userId} no backend.`,
            error
          );
          // Lançamos o erro para ser tratado no componente, se necessário
          return of(undefined);
        }
      })
    );
  }

  /**
   * ✅ ADICIONADO: Limpa o carrinho do localStorage para usuários deslogados.
   */
  clearCartLocal(): void {
    this.clearStorage();
    this.cartItemsSubject.next([]);
    console.log('🗑️ Carrinho local limpo');
  }

  // 💰 CÁLCULOS

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

  // 🎟️ CUPONS

  applyCoupon(code: string): boolean {
    const validCoupons: { [key: string]: number } = {
      PRIMEIRA10: 0.1,
      SUPLEMENTO15: 0.15,
      FRETE20: 0.2,
    };

    const upperCode = code.toUpperCase();
    if (validCoupons[upperCode]) {
      this.appliedDiscount = this.getSubtotal() * validCoupons[upperCode];
      this.syncCartWithBackend();
      return true;
    }
    return false;
  }

  // 🌐 BACKEND OPERATIONS

  private loadCartFromBackend(): Observable<any> {
    if (!this.currentUserId) {
      console.warn('⚠️ Sem userId para carregar carrinho');
      this.cartItemsSubject.next([]);
      return of({ items: [], discount: 0, shipping: 0 });
    }

    console.log('🔄 Buscando carrinho para:', this.currentUserId);

    return this.http
      .get<any>(`${this.API_URL}/${encodeURIComponent(this.currentUserId)}`)
      .pipe(
        tap((response) => {
          console.log('✅ Resposta do backend:', response);

          let items: CartItem[] = [];

          if (response && response.items && Array.isArray(response.items)) {
            items = response.items;
            console.log('📦 Itens encontrados:', items);
          } else {
            console.log('📦 Carrinho vazio (sem itens)');
          }

          this.cartItemsSubject.next(items);
          this.appliedDiscount = response?.discount || 0;
          this.shippingCost = response?.shipping || 0;

          console.log('✅ Carrinho sincronizado:', {
            items: items.length,
            discount: this.appliedDiscount,
            shipping: this.shippingCost,
          });
        }),
        catchError((error) => {
          console.error('❌ ERRO no GET carrinho:', {
            status: error.status,
            message: error.error?.message || error.message,
            userId: this.currentUserId,
          });

          this.cartItemsSubject.next([]);
          return of({ items: [], discount: 0, shipping: 0 });
        })
      );
  }

  private updateCartInBackend(items: CartItem[]): void {
    if (!this.backendEnabled) {
      console.log('⚠️ Backend desabilitado - não salvando');
      return;
    }

    if (!this.currentUserId) {
      console.warn('⚠️ Sem userId para salvar carrinho');
      return;
    }

    const cartData = {
      userId: this.currentUserId,
      items: items,
      discount: this.appliedDiscount,
      shipping: this.shippingCost,
    };

    console.log('🔄 PUT Request Details:', {
      url: `${this.API_URL}/${encodeURIComponent(this.currentUserId)}`,
      method: 'PUT',
      userId: this.currentUserId,
      itemCount: items.length,
      items: items,
      discount: this.appliedDiscount,
      shipping: this.shippingCost,
      fullPayload: cartData,
    });

    this.http
      .put<any>(
        `${this.API_URL}/${encodeURIComponent(this.currentUserId)}`,
        cartData
      )
      .pipe(
        tap((response) => {
          console.log('✅ PUT Success - Carrinho salvo:', response);
          this.cartItemsSubject.next(items);
        }),
        catchError((error) => {
          console.error('❌ PUT Error Details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            errorBody: error.error,
            url: error.url,
            headers: error.headers,
            sentPayload: cartData,
            userId: this.currentUserId,
          });

          // 🔍 Log específico da mensagem de erro do backend
          if (error.error && error.error.message) {
            console.error('🚨 Backend Error Message:', error.error.message);
          }

          if (error.error && error.error.trace) {
            console.error('🚨 Backend Stack Trace:', error.error.trace);
          }

          // 🚨 Se der erro no PUT, mantém no estado local
          console.log('⚠️ PUT falhou - mantendo carrinho apenas localmente');
          this.cartItemsSubject.next(items);

          return of(null);
        })
      )
      .subscribe();
  }

  private syncCartWithBackend(): void {
    if (this.currentUserId && this.currentSessionId) {
      this.updateCartInBackend(this.getCartItemsSnapshot());
    }
  }

  // 🧠 STORAGE LOCAL

  private loadCartFromStorage(): void {
    try {
      const items = this.getLocalStorageItems();
      console.log('📱 Carregando localStorage:', items.length, 'itens');
      this.cartItemsSubject.next(items);
    } catch (error) {
      console.error('❌ Erro localStorage:', error);
      this.cartItemsSubject.next([]);
    }
  }

  private getLocalStorageItems(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      console.log('💾 Salvando localStorage:', items.length, 'itens');
    } catch (error) {
      console.error('❌ Erro ao salvar localStorage:', error);
    }
  }

  private clearStorage(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ localStorage limpo');
  }

  // 🔄 HELPERS

  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items); // Atualiza o estado local primeiro

    if (this.currentUserId && this.currentSessionId && this.backendEnabled) {
      console.log('👤 Usuário logado - salvando no backend');
      this.updateCartInBackend(items);
    } else {
      console.log('👤 Salvando no localStorage');
      this.saveToStorage(items);
    }
  }

  private mergeCartItems(
    localItems: CartItem[],
    backendItems: CartItem[]
  ): CartItem[] {
    const merged = [...backendItems];

    localItems.forEach((localItem) => {
      const existing = merged.find((item) => item.id === localItem.id);
      if (existing) {
        existing.quantity += localItem.quantity;
      } else {
        merged.push(localItem);
      }
    });

    console.log('🔄 Mesclagem concluída:', {
      localStorage: localItems.length,
      backend: backendItems.length,
      final: merged.length,
    });

    return merged;
  }
}