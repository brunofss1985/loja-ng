// src/app/components/filtro/filtro.component.ts

import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { ProdutosService, CountedItem } from 'src/app/core/services/produtosService/produtos.service';

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

  allMarcas: CountedItem[] = [];
  allCategorias: CountedItem[] = [];

  filteredMarcas: CountedItem[] = [];
  filteredCategorias: CountedItem[] = [];

  selectedMarcas: string[] = [];
  selectedCategorias: string[] = [];

  // Novas propriedades para a contagem total
  totalCategorias: number = 0;
  totalMarcas: number = 0;

  minPrice: number = 0;
  maxPrice: number = 999999;

  constructor(private produtoService: ProdutosService, private router: Router) {}

  ngOnInit(): void {
    // Carrega a lista de categorias e a contagem total
    this.produtoService.buscarCategorias().subscribe((categorias) => {
      this.allCategorias = categorias;
      this.filteredCategorias = [...this.allCategorias];
    });
    this.produtoService.buscarTotalCategorias().subscribe(count => {
      this.totalCategorias = count;
    });

    // Carrega a lista de marcas e a contagem total
    this.produtoService.buscarMarcas().subscribe((marcas) => {
      this.allMarcas = marcas;
      this.filteredMarcas = [...this.allMarcas];
    });
    this.produtoService.buscarTotalMarcas().subscribe(count => {
      this.totalMarcas = count;
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
    this.produtoService.buscarMarcasPorCategorias(this.selectedCategorias).subscribe(marcas => {
      this.filteredMarcas = marcas;
    });

    this.produtoService.buscarCategoriasPorMarcas(this.selectedMarcas).subscribe(categorias => {
      this.filteredCategorias = categorias;
    });

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