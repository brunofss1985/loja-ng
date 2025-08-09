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
import { AuthService } from 'src/app/core/services/authService/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
   userType = this.authService.getUserType();

  // Indica se o topo está “afinado” após rolagem
  isScrolled = false;

  // Referências internas aos elementos do template
  private headerEl: HTMLElement | null = null;
  private menuToggleEl: HTMLInputElement | null = null;
  private burgerLabelEl: HTMLElement | null = null;

  // Guarda funções para limpar ouvintes
  private cleanupFns: Array<() => void> = [];

  constructor(private renderer: Renderer2, 
    private host: ElementRef,
    private authService: AuthService,
    private route: Router
  ) {}

  ngOnInit(): void {}

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

   exit() {
    localStorage.clear();
    this.route.navigate(['home']);
  }
}
