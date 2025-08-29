// src/app/pages/admin/produtos/produtos.component.ts

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
  
  // ✨ NOVAS PROPRIEDADES PARA A QUANTIDADE DE PRODUTOS
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
    this.route.params.subscribe((params) => {
      this.categoria = params['categoria'];
      this.currentPage = 0;

      if (!this.categoria) {
        this.filtroCategorias = [];
        this.filtroMarcas = [];
        this.filtroPrecoMin = 0;
        this.filtroPrecoMax = 999999;
      } else {
        this.filtroCategorias = [this.categoria];
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
    this.carregarProdutos();
  }

  onSortChanged(): void {
    this.currentPage = 0; // Volta para a primeira página ao mudar a ordenação
    this.carregarProdutos();
  }
  
  // ✨ NOVO MÉTODO PARA LIDAR COM A QUANTIDADE DE PRODUTOS POR PÁGINA
  onPageSizeChanged(): void {
    this.currentPage = 0; // Volta para a primeira página
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.produtoService
      .buscarComFiltros(
        this.filtroCategorias,
        this.filtroMarcas,
        this.filtroPrecoMin,
        this.filtroPrecoMax,
        this.currentPage,
        this.pageSize, // ✨ PASSA A NOVA PROPRIEDADE
        this.ordenacaoSelecionada
      )
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