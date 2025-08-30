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
import { ProdutosService, CountedItem } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  userType = this.authService.getUserType();

  public cartItemCount$: Observable<number> = this.cartService.cartItems$.pipe(
    map((items) => items.length)
  );

  isProfileDropdownOpen: boolean = false;
  isScrolled = false;
  
  private headerEl: HTMLElement | null = null;
  private menuToggleEl: HTMLInputElement | null = null;
  private burgerLabelEl: HTMLElement | null = null;
  private cleanupFns: Array<() => void> = [];
  
  searchTerm: string = '';

  // PROPRIEDADES PARA O DROPDOWN DE CATEGORIAS
  isCategoriesDropdownOpen: boolean = false;
  categorias: CountedItem[] = [];

  // NOVO: PROPRIEDADES PARA O DROPDOWN DE MARCAS
  isBrandsDropdownOpen: boolean = false;
  marcas: CountedItem[] = [];

  // NOVO: PROPRIEDADES PARA O DROPDOWN DE OBJETIVOS
  isObjectivesDropdownOpen: boolean = false;
  objetivos: CountedItem[] = [];

  constructor(
    private renderer: Renderer2,
    private host: ElementRef,
    private authService: AuthService,
    private route: Router,
    private cartService: CartService,
    private produtosService: ProdutosService
  ) {}

  ngOnInit(): void {
    // Busca as categorias
    this.produtosService.buscarCategorias().subscribe(
      (data) => {
        this.categorias = data;
      },
      (error) => {
        console.error('Erro ao buscar categorias:', error);
      }
    );

    // NOVO: Busca as marcas
    this.produtosService.buscarMarcas().subscribe(
      (data) => {
        this.marcas = data;
      },
      (error) => {
        console.error('Erro ao buscar marcas:', error);
      }
    );

    // NOVO: Busca os objetivos
    this.produtosService.buscarObjetivos().subscribe(
      (data) => {
        this.objetivos = data;
      },
      (error) => {
        console.error('Erro ao buscar objetivos:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    const root = this.host.nativeElement;
    this.headerEl = (root.querySelector('.header') as HTMLElement) || root;
    this.menuToggleEl = root.querySelector('#menu-toggle') as HTMLInputElement;
    this.burgerLabelEl = root.querySelector(
      '.menu-toggle-label'
    ) as HTMLElement;
    this.onScroll();
    this.syncAria();
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
    if (this.menuToggleEl) {
      const un = this.renderer.listen(this.menuToggleEl, 'change', () =>
        this.syncAria()
      );
      this.cleanupFns.push(un);
    }
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
    this.isProfileDropdownOpen = false;
  }

  toggleProfileDropdown(event: Event): void {
    event.stopPropagation();
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  toggleCategoriesDropdown(event: Event): void {
    event.stopPropagation();
    this.isCategoriesDropdownOpen = !this.isCategoriesDropdownOpen;
  }

  onCategorySelected(categoryName: string): void {
    this.route.navigate(['/produtos', categoryName]);
    this.isCategoriesDropdownOpen = false;
  }

  // NOVO: Métodos para o Dropdown de Marcas
  toggleBrandsDropdown(event: Event): void {
    event.stopPropagation();
    this.isBrandsDropdownOpen = !this.isBrandsDropdownOpen;
  }

  onBrandSelected(brandName: string): void {
    this.route.navigate(['/produtos', brandName]);
    this.isBrandsDropdownOpen = false;
  }

  // NOVO: Métodos para o Dropdown de Objetivos
  toggleObjectivesDropdown(event: Event): void {
    event.stopPropagation();
    this.isObjectivesDropdownOpen = !this.isObjectivesDropdownOpen;
  }

  onObjectiveSelected(objectiveName: string): void {
    this.route.navigate(['/produtos', objectiveName]);
    this.isObjectivesDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target)) {
      this.isProfileDropdownOpen = false;
      this.isCategoriesDropdownOpen = false;
      this.isBrandsDropdownOpen = false; // NOVO: Fecha o dropdown de marcas
      this.isObjectivesDropdownOpen = false; // NOVO: Fecha o dropdown de objetivos
    }
  }

  @HostListener('document:keydown.esc')
  onEscapeKeydown(): void {
    if (this.isProfileDropdownOpen) {
      this.isProfileDropdownOpen = false;
    }
    if (this.isCategoriesDropdownOpen) {
      this.isCategoriesDropdownOpen = false;
    }
    if (this.isBrandsDropdownOpen) {
      this.isBrandsDropdownOpen = false;
    }
    if (this.isObjectivesDropdownOpen) {
      this.isObjectivesDropdownOpen = false;
    }
  }

  onSearch(event: Event | KeyboardEvent): void {
    if (event instanceof KeyboardEvent && event.key !== 'Enter') {
      return;
    }
    const term = this.searchTerm.trim();
    if (term) {
      this.route.navigate(['/produtos/buscar', term]);
    } else {
      this.route.navigate(['/produtos']);
    }
    this.searchTerm = '';
  }
}