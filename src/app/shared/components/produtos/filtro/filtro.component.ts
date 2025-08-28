import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';
import { Router } from '@angular/router';

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
    minPreco: number;
    maxPreco: number;
  }>();

  // Listas completas (originais)
  allMarcas: string[] = [];
  allCategorias: string[] = [];

  // Listas filtradas (exibidas na tela)
  filteredMarcas: string[] = [];
  filteredCategorias: string[] = [];

  // Seleções do usuário
  selectedMarcas: string[] = [];
  selectedCategorias: string[] = [];

  minPrice: number = 0;
  maxPrice: number = 999999;

  constructor(private produtoService: ProdutosService, private router: Router) {}

  ngOnInit(): void {
    // Carrega as listas completas uma única vez
    this.produtoService.buscarMarcas().subscribe((marcas) => {
      this.allMarcas = marcas;
      this.filteredMarcas = [...this.allMarcas];
    });

    this.produtoService.buscarCategorias().subscribe((categorias) => {
      this.allCategorias = categorias;
      this.filteredCategorias = [...this.allCategorias];
    });
    this.checkScreenSize();
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
    this.updateFilters();
  }

  toggleCategoria(categoria: string): void {
    const index = this.selectedCategorias.indexOf(categoria);
    if (index > -1) {
      this.selectedCategorias.splice(index, 1);
    } else {
      this.selectedCategorias.push(categoria);
    }
    this.updateFilters();
  }

  updateFilters(): void {
    // Atualiza a lista de marcas com base nas categorias selecionadas
    this.produtoService.buscarMarcasPorCategorias(this.selectedCategorias).subscribe(marcas => {
      this.filteredMarcas = marcas;
    });

    // Atualiza a lista de categorias com base nas marcas selecionadas
    this.produtoService.buscarCategoriasPorMarcas(this.selectedMarcas).subscribe(categorias => {
      this.filteredCategorias = categorias;
    });

    // Emite as seleções para o componente pai (ListaProdutosComponent)
    this.filtersChanged.emit({
      categorias: this.selectedCategorias,
      marcas: this.selectedMarcas,
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
    this.selectedCategorias = [];
    this.selectedMarcas = [];
    this.minPrice = 0;
    this.maxPrice = 999999;
    
    // Volta a exibir todas as opções de filtro
    this.filteredMarcas = [...this.allMarcas];
    this.filteredCategorias = [...this.allCategorias];

    this.router.navigate(['/produtos']);
    this.filtersChanged.emit({
      categorias: this.selectedCategorias,
      marcas: this.selectedMarcas,
      minPreco: this.minPrice,
      maxPreco: this.maxPrice,
    });
  }

  toggleAllFilters() {
    this.isCollapsedAll = !this.isCollapsedAll;
  }
}