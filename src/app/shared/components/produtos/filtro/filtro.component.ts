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

  totalCategorias: number = 0;
  totalMarcas: number = 0;
  totalObjetivos: number = 0;

  minPrice: number = 0;
  maxPrice: number = 999999;

  constructor(
    private produtoService: ProdutosService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Carrega a lista de categorias e a contagem total
    this.produtoService.buscarCategorias().subscribe((categorias) => {
      this.allCategorias = categorias;
      this.filteredCategorias = [...this.allCategorias];
    });
    this.produtoService.buscarTotalCategorias().subscribe((count) => {
      this.totalCategorias = count;
    });

    // Carrega a lista de marcas e a contagem total
    this.produtoService.buscarMarcas().subscribe((marcas) => {
      this.allMarcas = marcas;
      this.filteredMarcas = [...this.allMarcas];
    });
    this.produtoService.buscarTotalMarcas().subscribe((count) => {
      this.totalMarcas = count;
    });

    // Carrega a lista de objetivos e a contagem total
    this.produtoService.buscarObjetivos().subscribe((objetivos) => {
      this.allObjetivos = objetivos;
      this.filteredObjetivos = [...this.allObjetivos];
    });
    this.produtoService.buscarTotalObjetivos().subscribe((count) => {
      this.totalObjetivos = count;
    });

    this.checkScreenSize();

    // 💡 PASSO CRUCIAL: Ler o estado inicial da URL
    combineLatest([
      this.activatedRoute.paramMap,
      this.activatedRoute.queryParamMap,
    ]).subscribe(([params, query]) => {
      this.selectedMarcas = query.get('marcas')?.split(',') || [];
      this.selectedCategorias = query.get('categorias')?.split(',') || [];
      this.selectedObjetivos = query.get('objetivos')?.split(',') || [];
      this.minPrice = +query.get('minPreco')! || 0;
      this.maxPrice = +query.get('maxPreco')! || 999999;
    });
  }

  @HostListener('window:resize', ['$event'])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    this.isCollapsedAll = this.isMobile;
  }

  toggleMarca(marca: string): void {
    const index = this.selectedMarcas.indexOf(marca);
    if (index > -1) {
      this.selectedMarcas.splice(index, 1);
    } else {
      this.selectedMarcas.push(marca);
    }
    this.updateUrl();
  }

  toggleCategoria(categoria: string): void {
    const index = this.selectedCategorias.indexOf(categoria);
    if (index > -1) {
      this.selectedCategorias.splice(index, 1);
    } else {
      this.selectedCategorias.push(categoria);
    }
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

  // ✅ NOVO: método que atualiza a URL com os filtros atuais
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
      queryParamsHandling: '', // Importante para remover queryParams antigos
    });
  }

  // ✅ CORRIGIDO: Agora o clearFilters também usa a navegação de URL
  clearFilters(): void {
    // Limpa os dados locais
    this.selectedCategorias = [];
    this.selectedMarcas = [];
    this.selectedObjetivos = [];
    this.minPrice = 0;
    this.maxPrice = 999999;

    // Navega para a URL base para limpar todos os filtros
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
}