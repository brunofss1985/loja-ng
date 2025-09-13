import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ProdutosService,
  CountedItem,
} from 'src/app/core/services/produtosService/produtos.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent implements OnInit {
  isCollapsedAll: boolean = false;
  isMobile: boolean = false;

  @Output() filtersChanged = new EventEmitter<{
    categorias: string[];
    marcas: string[];
    objetivos: string[];
    minPreco: number;
    maxPreco: number;
  }>();

  allMarcas: CountedItem[] = [];
  allCategorias: CountedItem[] = [];
  allObjetivos: CountedItem[] = [];

  filteredMarcas: CountedItem[] = [];
  filteredCategorias: CountedItem[] = [];
  filteredObjetivos: CountedItem[] = [];

  selectedMarcas: string[] = [];
  selectedCategorias: string[] = [];
  selectedObjetivos: string[] = [];

  totalMarcasAll: number = 0;
  totalCategoriasAll: number = 0;
  totalObjetivosAll: number = 0;
  totalProdutosAll: number = 0;

  minPrice: number = 0;
  maxPrice: number = 999999;

  constructor(
    private produtoService: ProdutosService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.produtoService.buscarCategorias().subscribe((categorias) => {
      this.allCategorias = categorias;
      this.filteredCategorias = [...this.allCategorias];
    });
    this.produtoService.buscarMarcas().subscribe((marcas) => {
      this.allMarcas = marcas;
      this.filteredMarcas = [...this.allMarcas];
    });
    this.produtoService.buscarObjetivos().subscribe((objetivos) => {
      this.allObjetivos = objetivos;
      this.filteredObjetivos = [...this.allObjetivos];
    });

    this.produtoService.buscarTotalCategorias().subscribe((c) => {
      this.totalCategoriasAll = c;
    });
    this.produtoService.buscarTotalMarcas().subscribe((m) => {
      this.totalMarcasAll = m;
    });
    this.produtoService.buscarTotalObjetivos().subscribe((o) => {
      this.totalObjetivosAll = o;
    });

    this.produtoService.buscarComFiltros().subscribe(response => {
      this.totalProdutosAll = response.totalElements;
    });

    this.checkScreenSize();

    combineLatest([
      this.activatedRoute.paramMap,
      this.activatedRoute.queryParamMap,
    ]).subscribe(([params, query]) => {
      const marcasParam = query.get('marcas') || '';
      const categoriasParam = query.get('categorias') || '';
      const objetivosParam = query.get('objetivos') || '';

      this.selectedMarcas = marcasParam ? marcasParam.split(',').filter(Boolean) : [];
      this.selectedCategorias = categoriasParam ? categoriasParam.split(',').filter(Boolean) : [];
      this.selectedObjetivos = objetivosParam ? objetivosParam.split(',').filter(Boolean) : [];

      this.minPrice = query.get('minPreco') ? +query.get('minPreco')! : 0;
      this.maxPrice = query.get('maxPreco') ? +query.get('maxPreco')! : 999999;

      this.applyFiltersToLists();
    });
  }

checkScreenSize(): void {
  this.isMobile = window.innerWidth <= 768;

  // 👇 se for mobile, deixa o filtro SEMPRE expandido (sem collapsed-all)
  this.isCollapsedAll = false;
}

  toggleMarca(marca: string): void {
    const index = this.selectedMarcas.indexOf(marca);
    if (index > -1) {
      this.selectedMarcas.splice(index, 1);
    } else {
      this.selectedMarcas.push(marca);
    }
    this.applyFiltersToLists();
    this.updateUrl();
  }

  toggleCategoria(categoria: string): void {
    const index = this.selectedCategorias.indexOf(categoria);
    if (index > -1) {
      this.selectedCategorias.splice(index, 1);
    } else {
      this.selectedCategorias.push(categoria);
    }
    this.applyFiltersToLists();
    this.updateUrl();
  }

  toggleObjetivo(objetivo: string): void {
    const index = this.selectedObjetivos.indexOf(objetivo);
    if (index > -1) {
      this.selectedObjetivos.splice(index, 1);
    } else {
      this.selectedObjetivos.push(objetivo);
    }
    this.updateUrl();
  }

  private applyFiltersToLists(): void {
    if (this.selectedMarcas.length > 0) {
      this.produtoService
        .buscarCategoriasPorMarcas(this.selectedMarcas)
        .subscribe((cats) => {
          this.filteredCategorias = cats;
        }, () => {
          this.filteredCategorias = [...this.allCategorias];
        });
    } else {
      this.filteredCategorias = [...this.allCategorias];
    }

    if (this.selectedCategorias.length > 0) {
      this.produtoService
        .buscarMarcasPorCategorias(this.selectedCategorias)
        .subscribe((marcas) => {
          this.filteredMarcas = marcas;
        }, () => {
          this.filteredMarcas = [...this.allMarcas];
        });

      this.produtoService
        .buscarObjetivosPorCategorias(this.selectedCategorias)
        .subscribe((objs) => {
          this.filteredObjetivos = objs;
        }, () => {
          this.filteredObjetivos = [...this.allObjetivos];
        });
    } else {
      this.filteredMarcas = [...this.allMarcas];
      this.filteredObjetivos = [...this.allObjetivos];
    }
  }

  updateUrl() {
    this.router.navigate(['/produtos'], {
      queryParams: {
        categorias: this.selectedCategorias.length ? this.selectedCategorias.join(',') : null,
        marcas: this.selectedMarcas.length ? this.selectedMarcas.join(',') : null,
        objetivos: this.selectedObjetivos.length ? this.selectedObjetivos.join(',') : null,
        minPreco: this.minPrice > 0 ? this.minPrice : null,
        maxPreco: this.maxPrice < 999999 ? this.maxPrice : null,
      },
      queryParamsHandling: '',
    });
  }

  clearFilters(): void {
    this.selectedCategorias = [];
    this.selectedMarcas = [];
    this.selectedObjetivos = [];
    this.minPrice = 0;
    this.maxPrice = 999999;

    this.filteredCategorias = [...this.allCategorias];
    this.filteredMarcas = [...this.allMarcas];
    this.filteredObjetivos = [...this.allObjetivos];

    this.router.navigate(['/produtos'], { queryParams: {} });
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

  toggleAllFilters() {
    this.isCollapsedAll = !this.isCollapsedAll;
  }

  get totalCategorias(): number {
    return this.filteredCategorias.length;
  }

  get totalMarcas(): number {
    return this.filteredMarcas.length;
  }

  get totalObjetivos(): number {
    return this.filteredObjetivos.length;
  }

  get totalProdutos(): number {
    if (this.selectedMarcas.length > 0) {
      return this.filteredMarcas.reduce((acc, item) => acc + (item.count || 0), 0);
    }
    if (this.selectedCategorias.length > 0) {
      return this.filteredCategorias.reduce((acc, item) => acc + (item.count || 0), 0);
    }
    if (this.selectedObjetivos.length > 0) {
      return this.filteredObjetivos.reduce((acc, item) => acc + (item.count || 0), 0);
    }
    return this.totalProdutosAll;
  }


}
