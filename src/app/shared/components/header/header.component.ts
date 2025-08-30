// src/app/components/header/header.component.ts

import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Renderer2,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/authService/auth.service';
import { CartService } from 'src/app/core/services/cartService/cart-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  // Variável para exibir o tipo de usuário logado
  userType = this.authService.getUserType();

  // Observable que guarda a contagem de itens no carrinho
  public cartItemCount$: Observable<number> = this.cartService.cartItems$.pipe(
    map((items) => items.length)
  );

  // Variável para controlar o estado do dropdown do perfil
  isProfileDropdownOpen: boolean = false;

  // Indica se o topo está “afinado” após rolagem
  isScrolled = false;

  // Referências internas aos elementos do template
  private headerEl: HTMLElement | null = null;
  private menuToggleEl: HTMLInputElement | null = null;
  private burgerLabelEl: HTMLElement | null = null;

  // Guarda funções para limpar ouvintes
  private cleanupFns: Array<() => void> = [];

  // Variável para o termo de busca
  searchTerm: string = '';

  constructor(
    private renderer: Renderer2,
    private host: ElementRef,
    private authService: AuthService,
    private route: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // A lógica de inicialização do cartItemCount$ foi movida para a declaração
    // da propriedade, então não precisamos mais dela aqui.
  }

  ngAfterViewInit(): void {
    const root = this.host.nativeElement;

    // Container do cabeçalho (use o elemento com a classe .header como raiz visual)
    this.headerEl = (root.querySelector('.header') as HTMLElement) || root;

    // Elementos do menu mobile
    this.menuToggleEl = root.querySelector('#menu-toggle') as HTMLInputElement;
    this.burgerLabelEl = root.querySelector(
      '.menu-toggle-label'
    ) as HTMLElement;

    // Estado inicial
    this.onScroll();
    this.syncAria();

    // Fecha o menu ao clicar num item do menu mobile
    const mobileLinks = root.querySelectorAll('.header-botton a');
    mobileLinks.forEach((a: any) => {
      const un = this.renderer.listen(a, 'click', () => {
        if (this.menuToggleEl && this.menuToggleEl.checked) {
          this.menuToggleEl.checked = false;
          this.syncAria();
        }
      });
      this.cleanupFns.push(un);
    });

    // Sincroniza a indicação de aberto/fechado ao alternar o toggle
    if (this.menuToggleEl) {
      const un = this.renderer.listen(this.menuToggleEl, 'change', () =>
        this.syncAria()
      );
      this.cleanupFns.push(un);
    }

    // Fecha o menu ao aumentar a tela para desktop
    const unResize = this.renderer.listen('window', 'resize', () => {
      if (
        window.innerWidth >= 992 &&
        this.menuToggleEl &&
        this.menuToggleEl.checked
      ) {
        this.menuToggleEl.checked = false;
        this.syncAria();
      }
    });
    this.cleanupFns.push(unResize);
  }

  // Afina o cabeçalho ao rolar
  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 10;
    if (!this.headerEl) return;
    if (this.isScrolled) {
      this.renderer.addClass(this.headerEl, 'is-scrolled');
    } else {
      this.renderer.removeClass(this.headerEl, 'is-scrolled');
    }
  }

  // Atualiza acessibilidade do botão hambúrguer
  private syncAria(): void {
    if (this.burgerLabelEl) {
      const expanded = this.menuToggleEl?.checked ? 'true' : 'false';
      this.renderer.setAttribute(this.burgerLabelEl, 'aria-expanded', expanded);
    }
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach((un) => {
      try {
        un();
      } catch {}
    });
    this.cleanupFns = [];
  }

  exit(): void {
    this.authService.clearSession();
    this.isProfileDropdownOpen = false; // Fecha o dropdown ao sair
  }

  // Métodos para o Dropdown do Perfil
  toggleProfileDropdown(event: Event): void {
    // Para parar a propagação do evento de clique,
    // garantindo que o `onDocumentClick` não feche o menu imediatamente
    event.stopPropagation();
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  // Ouve cliques em qualquer lugar do documento
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Se o clique não estiver dentro do componente, fecha o dropdown
    if (!this.host.nativeElement.contains(event.target)) {
      this.isProfileDropdownOpen = false;
    }
  }

  // Ouve a tecla ESC
  @HostListener('document:keydown.esc')
  onEscapeKeydown(): void {
    if (this.isProfileDropdownOpen) {
      this.isProfileDropdownOpen = false;
    }
  }

  // Método de busca atualizado para limpar o campo
  onSearch(event: Event | KeyboardEvent): void {
    if (event instanceof KeyboardEvent && event.key !== 'Enter') {
      return;
    }
    const term = this.searchTerm.trim();
    if (term) {
      this.route.navigate(['/produtos/buscar', term]);
    } else {
      // Se o campo estiver vazio, apenas navegue para a página de produtos
      this.route.navigate(['/produtos']);
    }

    // ✨ LINHA ADICIONADA: Limpa o campo de busca
    this.searchTerm = '';
  }
}