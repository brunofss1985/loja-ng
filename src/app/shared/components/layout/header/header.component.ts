import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Renderer2,
  ElementRef,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/authService/auth.service';
import { CartService } from 'src/app/core/services/cartService/cart-service.service';
import {
  ProdutosService,
  CountedItem,
} from 'src/app/core/services/produtosService/produtos.service';

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

  // DROPDOWN CATEGORIAS
  isCategoriesDropdownOpen: boolean = false;
  categorias: CountedItem[] = [];

  // DROPDOWN MARCAS
  isBrandsDropdownOpen: boolean = false;
  marcas: CountedItem[] = [];

  // DROPDOWN OBJETIVOS
  isObjectivesDropdownOpen: boolean = false;
  objetivos: CountedItem[] = [];

  constructor(
    private renderer: Renderer2,
    private host: ElementRef,
    private authService: AuthService,
    private router: Router, // Use o nome router, pois é mais comum
    private cartService: CartService,
    private produtosService: ProdutosService
  ) {}

  ngOnInit(): void {
    this.produtosService.buscarCategorias().subscribe((data) => {
      this.categorias = data;
    });

    this.produtosService.buscarMarcas().subscribe((data) => {
      this.marcas = data;
    });

    this.produtosService.buscarObjetivos().subscribe((data) => {
      this.objetivos = data;
    });
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

  toggleBrandsDropdown(event: Event): void {
    event.stopPropagation();
    this.isBrandsDropdownOpen = !this.isBrandsDropdownOpen;
  }

  toggleObjectivesDropdown(event: Event): void {
    event.stopPropagation();
    this.isObjectivesDropdownOpen = !this.isObjectivesDropdownOpen;
  }

  onCategorySelected(categoryName: string): void {
    // Ao selecionar uma categoria, navega para produtos, limpando os outros filtros.
    // O `queryParams` será o único parâmetro na URL.
    this.router.navigate(['/produtos'], {
      queryParams: { categorias: categoryName },
    });
    this.isCategoriesDropdownOpen = false;
  }

  onBrandSelected(brandName: string): void {
    // Ao selecionar uma marca, navega para produtos, limpando os outros filtros.
    this.router.navigate(['/produtos'], {
      queryParams: { marcas: brandName },
    });
    this.isBrandsDropdownOpen = false;
  }

  onObjectiveSelected(objectiveName: string): void {
    // Ao selecionar um objetivo, navega para produtos, limpando os outros filtros.
    this.router.navigate(['/produtos'], {
      queryParams: { objetivos: objectiveName },
    });
    this.isObjectivesDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target)) {
      this.isProfileDropdownOpen = false;
      this.isCategoriesDropdownOpen = false;
      this.isBrandsDropdownOpen = false;
      this.isObjectivesDropdownOpen = false;
    }
  }

  @HostListener('document:keydown.esc')
  onEscapeKeydown(): void {
    if (this.isProfileDropdownOpen) this.isProfileDropdownOpen = false;
    if (this.isCategoriesDropdownOpen) this.isCategoriesDropdownOpen = false;
    if (this.isBrandsDropdownOpen) this.isBrandsDropdownOpen = false;
    if (this.isObjectivesDropdownOpen) this.isObjectivesDropdownOpen = false;
  }

  onSearch(event: Event | KeyboardEvent): void {
    if (event instanceof KeyboardEvent && event.key !== 'Enter') {
      return;
    }
    const term = this.searchTerm.trim();
    if (term) {
      // Navega para a rota de busca e remove todos os query parameters existentes.
      this.router.navigate(['/produtos/buscar', term], {
        queryParams: {},
      });
    } else {
      // Se a busca for vazia, vai para a página de produtos, limpando os filtros.
      this.router.navigate(['/produtos'], {
        queryParams: {},
      });
    }
    this.searchTerm = '';
  }
}