import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, forkJoin } from 'rxjs'; // Adicionando forkJoin
import { HttpClient } from '@angular/common/http';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { CartItem } from '../../models/cart-item.model';
import { AuthService } from '../authService/auth.service';
import { environment } from 'src/environments/environment';

const STORAGE_KEY = 'cart_items';

@Injectable({ providedIn: 'root' })
export class CartService implements OnDestroy {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private appliedDiscount = 0;
  private shippingCost = 0;
  private readonly API_URL = `${environment.apiUrl}//api/cart`;
  private currentSessionId: string | null = null;
  private currentUserId: string | null = null;
  private backendEnabled = true;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.initializeCart();
  }

  ngOnDestroy(): void {}

  private initializeCart(): void {
    if (!this.authService.isAuthenticated()) {
      console.log('👤 Usuário deslogado - usando localStorage');
      this.currentSessionId = null;
      this.currentUserId = null;
      this.loadCartFromStorage();
    } else {
      console.log('🔑 Usuário já logado. Carregando dados...');
      const sessionId = this.authService.getSessionId();
      const user = this.authService.getUser();
      this.currentSessionId = sessionId;
      this.currentUserId = user?.email || user?.id;
      this.loadCartFromBackend().subscribe(
        (items) => {
          this.cartItemsSubject.next(items);
          console.log(
            '✅ Carrinho inicial carregado do backend. Itens:',
            items.length
          );
        },
        (error) => {
          console.error('❌ Erro no carregamento inicial do carrinho:', error);
          this.cartItemsSubject.next([]);
        }
      );
    }
  }

  public promptAndSyncOnLogin(): void {
    const localItems = this.getLocalStorageItems();
    console.log('🔍 Itens no localStorage antes do login:', localItems.length);

    if (localItems.length === 0) {
      console.log(
        '📦 Sem itens locais, carregando carrinho do backend diretamente.'
      );
      this.loadCartFromBackend().subscribe((items) =>
        this.cartItemsSubject.next(items)
      );
      return;
    }

    const user = this.authService.getUser();
    if (!user || !user.id) {
      console.log(
        '⚠️ Usuário não autenticado ou ID de usuário não disponível. Sincronização cancelada.'
      );
      return;
    }
    this.currentUserId = user.id;

    const merge = confirm(
      `Você está logado como ${user.email}. Deseja mesclar os ${localItems.length} itens do seu carrinho atual com sua conta?`
    );

    if (merge) {
      console.log(
        '✅ Usuário confirmou a mesclagem. Buscando dados do backend para mesclar...'
      );
      const userId = user?.email || user?.id;

      // 🚀 FLUXO CORRIGIDO COM forkJoin
      forkJoin({
        backendItems: this.loadCartFromBackend(),
      })
        .pipe(
          map(({ backendItems }) => {
            const mergedItems = this.mergeCartItems(localItems, backendItems);
            console.log('🔄 Mesclagem concluída:', {
              localStorage: localItems.length,
              backend: backendItems.length,
              final: mergedItems.length,
            });
            return mergedItems;
          }),
          switchMap((mergedItems) =>
            this.updateCartInBackend(mergedItems).pipe(map(() => mergedItems))
          )
        )
        .subscribe({
          next: (finalItems) => {
            this.cartItemsSubject.next(finalItems);
            this.clearStorage();
            console.log(
              '✅ Sincronização e mesclagem concluídas. Carrinho agora tem',
              finalItems.length,
              'itens.'
            );
          },
          error: (error) => {
            console.error('❌ Falha na mesclagem. Mantendo carrinho local.', error);
            this.cartItemsSubject.next(localItems);
          },
        });
    } else {
      console.log(
        '❌ Usuário cancelou a mesclagem. Limpando o carrinho local e carregando do backend.'
      );
      this.clearStorage();
      this.loadCartFromBackend().subscribe((items) =>
        this.cartItemsSubject.next(items)
      );
    }
  }

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

  clearCartBack(userId: string): Observable<void> {
    if (!userId) {
      console.error('❌ Falha ao limpar carrinho no backend: userId inválido.');
      return of(undefined);
    }
    return this.http.delete<void>(`${this.API_URL}/${userId}`).pipe(
      tap(() =>
        console.log(`✅ Carrinho do usuário ${userId} limpo no backend.`)
      ),
      catchError((error) => {
        if (error.status === 404) {
          console.warn(
            `⚠️ Carrinho para o usuário ${userId} não encontrado no backend (OK).`
          );
          return of(undefined);
        } else {
          console.error(
            `❌ Erro ao limpar carrinho do usuário ${userId} no backend.`,
            error
          );
          return of(undefined);
        }
      })
    );
  }

  clearCartLocal(): void {
    this.clearStorage();
    this.cartItemsSubject.next([]);
    console.log('🗑️ Carrinho local limpo');
  }

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

  private loadCartFromBackend(): Observable<CartItem[]> {
    if (!this.currentUserId) {
      console.warn('⚠️ Sem userId para carregar carrinho');
      return of([]);
    }
    return this.http
      .get<any>(`${this.API_URL}/${encodeURIComponent(this.currentUserId)}`)
      .pipe(
        tap((response) => {
          this.appliedDiscount = response?.discount || 0;
          this.shippingCost = response?.shipping || 0;
        }),
        map((response) => response?.items || []),
        tap((items) =>
          console.log('✅ Itens carregados do backend:', items.length)
        ),
        catchError((error) => {
          console.error('❌ ERRO no GET carrinho:', {
            status: error.status,
            message: error.message,
          });
          return of([]);
        })
      );
  }

  private updateCartInBackend(items: CartItem[]): Observable<any> {
    if (!this.backendEnabled || !this.currentUserId) {
      console.warn('⚠️ Backend desabilitado ou sem userId - não salvando');
      return of(null);
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
      itemCount: items.length,
    });

    return this.http
      .put<any>(
        `${this.API_URL}/${encodeURIComponent(this.currentUserId)}`,
        cartData
      )
      .pipe(
        tap(() => console.log('✅ PUT Success - Carrinho salvo no backend.')),
        catchError((error) => {
          console.error('❌ PUT Error:', error);
          return of(null);
        })
      );
  }

  private syncCartWithBackend(): void {
    if (this.currentUserId && this.currentSessionId) {
      this.updateCartInBackend(this.getCartItemsSnapshot()).subscribe();
    }
  }

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

  private updateCart(items: CartItem[]): void {
    if (this.currentUserId && this.currentSessionId && this.backendEnabled) {
      console.log('👤 Usuário logado - salvando no backend');
      this.updateCartInBackend(items).subscribe(() => {
        this.cartItemsSubject.next(items);
      });
    } else {
      console.log('👤 Salvando no localStorage');
      this.cartItemsSubject.next(items);
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
    return merged;
  }
}