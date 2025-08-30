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

  // listas totais (vindas da API)
  allMarcas: CountedItem[] = [];
  allCategorias: CountedItem[] = [];
  allObjetivos: CountedItem[] = [];

  // listas filtradas (usadas no template)
  filteredMarcas: CountedItem[] = [];
  filteredCategorias: CountedItem[] = [];
  filteredObjetivos: CountedItem[] = [];

  // selecionados
  selectedMarcas: string[] = [];
  selectedCategorias: string[] = [];
  selectedObjetivos: string[] = [];

  // totais globais (para referência, caso precise)
  totalMarcasAll: number = 0;
  totalCategoriasAll: number = 0;
  totalObjetivosAll: number = 0;

  // preços
  minPrice: number = 0;
  maxPrice: number = 999999;

  constructor(
    private produtoService: ProdutosService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Carrega listas completas (contagem incluída)
    this.produtoService.buscarCategorias().subscribe((categorias) => {
      this.allCategorias = categorias;
      // inicialmente mostrar todas
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

    // Carrega totais globais (opcional)
    this.produtoService.buscarTotalCategorias().subscribe((c) => {
      this.totalCategoriasAll = c;
    });
    this.produtoService.buscarTotalMarcas().subscribe((m) => {
      this.totalMarcasAll = m;
    });
    this.produtoService.buscarTotalObjetivos().subscribe((o) => {
      this.totalObjetivosAll = o;
    });

    this.checkScreenSize();

    // Ler estado inicial da URL (se houver filtros aplicados)
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

      // aplica filtros sobre as listas (chama endpoints que retornam contagens filtradas)
      this.applyFiltersToLists();
    });
  }

  @HostListener('window:resize', ['$event'])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    this.isCollapsedAll = this.isMobile;
  }

  // Toggle marca
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

  // Toggle categoria
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

  // Toggle objetivo
  toggleObjetivo(objetivo: string): void {
    const index = this.selectedObjetivos.indexOf(objetivo);
    if (index > -1) {
      this.selectedObjetivos.splice(index, 1);
    } else {
      this.selectedObjetivos.push(objetivo);
    }

    // Nota: não existe no service um endpoint "categorias-por-objetivo" ou "marcas-por-objetivo".
    // Se você tiver endpoints como esses no backend podemos chamá-los aqui.
    // Por enquanto, apenas atualizamos a URL (e o backend fará a filtragem de produtos).
    this.updateUrl();
  }

  // Aplica filtros e atualiza as listas filtradas usando os endpoints já disponíveis
  private applyFiltersToLists(): void {
    // 1) Se existem marcas selecionadas -> atualiza categorias compatíveis
    if (this.selectedMarcas.length > 0) {
      this.produtoService
        .buscarCategoriasPorMarcas(this.selectedMarcas)
        .subscribe((cats) => {
          this.filteredCategorias = cats;
        }, () => {
          // fallback
          this.filteredCategorias = [...this.allCategorias];
        });
    } else {
      // sem marcas selecionadas → mostra todas as categorias
      this.filteredCategorias = [...this.allCategorias];
    }

    // 2) Se existem categorias selecionadas -> atualiza marcas compatíveis e objetivos compatíveis
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
      // sem categorias selecionadas → mostra todas marcas e objetivos
      this.filteredMarcas = [...this.allMarcas];
      this.filteredObjetivos = [...this.allObjetivos];
    }

    // Observação: se quiser que selecionar objetivos também filtre categorias/marcas,
    // será necessário adicionar endpoints no backend (ex: /categorias-por-objetivo, /marcas-por-objetivo).
  }

  // Atualiza a URL com os filtros
  updateUrl() {
    this.router.navigate(['/produtos'], {
      queryParams: {
        categorias: this.selectedCategorias.length
          ? this.selectedCategorias.join(',')
          : null,
        marcas: this.selectedMarcas.length
          ? this.selectedMarcas.join(',')
          : null,
        objetivos: this.selectedObjetivos.length
          ? this.selectedObjetivos.join(',')
          : null,
        minPreco: this.minPrice > 0 ? this.minPrice : null,
        maxPreco: this.maxPrice < 999999 ? this.maxPrice : null,
      },
      queryParamsHandling: '', // remove query params antigos (como no seu código original)
    });
  }

  // Limpa filtros e restaura listas
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

  // Getters expostos ao template → soma dos `count` das listas filtradas
  get totalCategorias(): number {
    return this.filteredCategorias.reduce((acc, item) => acc + (item.count || 0), 0);
  }

  get totalMarcas(): number {
    return this.filteredMarcas.reduce((acc, item) => acc + (item.count || 0), 0);
  }

  get totalObjetivos(): number {
    return this.filteredObjetivos.reduce((acc, item) => acc + (item.count || 0), 0);
  }
}
