// src/app/pages/admin/produtos/lista-produtos.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  styleUrls: ['./lista-produtos.component.scss'],
})
export class ListaProdutosComponent implements OnInit {
  termoDeBusca?: string;
  categoria?: string;
  produtos!: any[];
  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;

  // Propriedades para a quantidade de produtos por página
  pageSize: number = 8;
  opcoesTamanhoPagina = [
    { nome: '4', valor: 4 },
    { nome: '8', valor: 8 },
    { nome: '16', valor: 16 },
    { nome: '24', valor: 24 },
    { nome: 'Todos', valor: 999999 }, // Valor alto para exibir todos
  ];

  ordenacaoSelecionada: string = 'relevance';
  opcoesOrdenacao = [
    { nome: 'Relevância', valor: 'relevance' },
    { nome: 'Mais recentes', valor: 'dataCadastro,desc' },
    { nome: 'Menor preço', valor: 'preco,asc' },
    { nome: 'Maior preço', valor: 'preco,desc' },
    { nome: 'Produtos A-Z', valor: 'nome,asc' },
    { nome: 'Produtos Z-A', valor: 'nome,desc' },
  ];

  filtroCategorias: string[] = [];
  filtroMarcas: string[] = [];
  filtroPrecoMin: number = 0;
  filtroPrecoMax: number = 999999;

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutosService
  ) {}

  ngOnInit(): void {
    // 🌟 LÓGICA ATUALIZADA: Observa as mudanças na URL
    this.route.params.subscribe((params) => {
      this.termoDeBusca = params['termo'];
      this.categoria = params['categoria'];
      this.currentPage = 0;

      // Reseta os filtros ao mudar de rota (para não misturar)
      this.filtroCategorias = [];
      this.filtroMarcas = [];
      this.filtroPrecoMin = 0;
      this.filtroPrecoMax = 999999;

      if (this.categoria) {
        this.filtroCategorias.push(this.categoria);
      }

      this.carregarProdutos();
    });
  }

  onFiltersChanged(event: {
    categorias: string[];
    marcas: string[];
    minPreco: number;
    maxPreco: number;
  }): void {
    this.filtroCategorias = event.categorias;
    this.filtroMarcas = event.marcas;
    this.filtroPrecoMin = event.minPreco;
    this.filtroPrecoMax = event.maxPreco;
    this.currentPage = 0;
    this.termoDeBusca = undefined; // Garante que a busca por termo seja ignorada
    this.carregarProdutos();
  }

  onSortChanged(): void {
    this.currentPage = 0;
    this.carregarProdutos();
  }

  onPageSizeChanged(): void {
    this.currentPage = 0;
    this.carregarProdutos();
  }

  carregarProdutos() {
    // 🌟 LÓGICA ATUALIZADA: Decide qual método de serviço chamar
    let produtoObservable;

    if (this.termoDeBusca) {
      produtoObservable = this.produtoService.buscarPorTermo(
        this.termoDeBusca,
        this.currentPage,
        this.pageSize,
        this.ordenacaoSelecionada
      );
    } else {
      produtoObservable = this.produtoService.buscarComFiltros(
        this.filtroCategorias,
        this.filtroMarcas,
        this.filtroPrecoMin,
        this.filtroPrecoMax,
        this.currentPage,
        this.pageSize,
        this.ordenacaoSelecionada
      );
    }

    produtoObservable.subscribe((response) => {
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