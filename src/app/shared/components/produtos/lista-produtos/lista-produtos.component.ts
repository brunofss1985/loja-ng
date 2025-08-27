import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  styleUrls: ['./lista-produtos.component.scss'],
})
export class ListaProdutosComponent implements OnInit {
  categoria!: string;
  produtos!: any[];
  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 8;
  
  filtroMarcas: string[] = [];
  filtroPrecoMin: number = 0;
  filtroPrecoMax: number = 999999;

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutosService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.categoria = params['categoria'];
      this.currentPage = 0;
      this.filtroMarcas = [];
      this.filtroPrecoMin = 0;
      this.filtroPrecoMax = 999999;
      this.carregarProdutos();
    });
  }
  
  onFiltersChanged(event: { marcas: string[]; minPreco: number; maxPreco: number }): void {
    this.filtroMarcas = event.marcas;
    this.filtroPrecoMin = event.minPreco;
    this.filtroPrecoMax = event.maxPreco;
    this.currentPage = 0; 
    this.carregarProdutos();
  }

  carregarProdutos() {
    // CORREÇÃO: Passa 'undefined' se a categoria não estiver na rota
    const categoriaParaFiltro = this.categoria === undefined ? undefined : this.categoria;

    this.produtoService
      .buscarComFiltros(categoriaParaFiltro, this.filtroMarcas, this.filtroPrecoMin, this.filtroPrecoMax, this.currentPage, this.pageSize)
      .subscribe((response) => {
        this.produtos = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
      });
  }

  proximaPagina() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.carregarProdutos();
    }
  }

  paginaAnterior() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.carregarProdutos();
    }
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.carregarProdutos();
    }
  }
}