import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent implements OnInit, OnChanges {
  isCollapsedAll: boolean = false; // Inicia o filtro fechado
  isMobile: boolean = false;

  @Input() currentCategory: string | undefined;
  @Output() filtersChanged = new EventEmitter<{
    marcas: string[];
    minPreco: number;
    maxPreco: number;
  }>();

  marcas: string[] = [];
  selectedBrands: string[] = [];
  minPrice: number = 0;
  maxPrice: number = 999999;
  selectedCategory: string = 'todos';

  constructor(private produtoService: ProdutosService) {}

  ngOnInit(): void {
    this.produtoService.buscarMarcas().subscribe((marcas) => {
      this.marcas = marcas;
    });
    this.checkScreenSize();
  }

  // Detecta mudanças na categoria da rota e atualiza o filtro
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentCategory'] && changes['currentCategory'].currentValue) {
      this.selectedCategory = changes['currentCategory'].currentValue;
    } else {
      // Se a rota for '/produtos', a categoria é 'todos'
      this.selectedCategory = 'todos';
    }
    this.applyFilters();
  }
  
  // Verifica o tamanho da tela para definir o estado inicial do filtro
  @HostListener('window:resize', ['$event'])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    this.isCollapsedAll = this.isMobile;
  }

  toggleBrand(marca: string): void {
    const index = this.selectedBrands.indexOf(marca);
    if (index > -1) {
      this.selectedBrands.splice(index, 1);
    } else {
      this.selectedBrands.push(marca);
    }
    this.applyFilters();
  }

  selectCategory(categoria: string): void {
    this.selectedCategory = categoria;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filtersChanged.emit({
      marcas: this.selectedBrands,
      minPreco: this.minPrice,
      maxPreco: this.maxPrice,
    });
  }

  toggleSection(event: Event): void {
    const header = event.currentTarget as HTMLElement;
    const section = header.parentElement;

    if (section) {
      const isExpanded = section.classList.contains('expanded');

      if (isExpanded) {
        section.classList.remove('expanded');
        section.classList.add('collapsed');
      } else {
        section.classList.remove('collapsed');
        section.classList.add('expanded');
      }
    }
  }

  clearFilters(): void {
    this.selectedCategory = 'todos';
    this.selectedBrands = [];
    this.minPrice = 0;
    this.maxPrice = 999999;

    // Chame seu método de aplicar filtros ou emita evento
    this.applyFilters();
  }

  toggleAllFilters() {
    this.isCollapsedAll = !this.isCollapsedAll;
  }
}