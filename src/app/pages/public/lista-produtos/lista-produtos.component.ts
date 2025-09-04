import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  styleUrls: ['./lista-produtos.component.scss'],
})
export class ListaProdutosComponent implements OnInit {
  termoDeBusca?: string;
  produtos!: any[];
  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;

  pageSize: number = 8;
  opcoesTamanhoPagina = [
    { nome: '4', valor: 4 },
    { nome: '8', valor: 8 },
    { nome: '16', valor: 16 },
    { nome: '24', valor: 24 },
    { nome: 'Todos', valor: 999999 },
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
  filtroObjetivos: string[] = [];
  filtroPrecoMin: number = 0;
  filtroPrecoMax: number = 999999;

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutosService
  ) {}

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      ([params, query]) => {
        // 🚨 PASSO 1: Limpar todos os filtros existentes
        this.limparFiltros();

        // 🔎 PASSO 2: Detectar o tipo de busca
        this.termoDeBusca = params.get('termo') || undefined;

        if (this.termoDeBusca) {
          // Caso seja uma busca por termo, apenas a propriedade `termoDeBusca` será preenchida.
        } else {
          // Caso seja uma busca por filtro, preenche os filtros a partir da URL
          const categoriasFromUrl = query.get('categorias');
          if (categoriasFromUrl) {
            this.filtroCategorias = categoriasFromUrl.split(',').map((c) => c.trim());
          }

          const marcasFromUrl = query.get('marcas');
          if (marcasFromUrl) {
            this.filtroMarcas = marcasFromUrl.split(',').map((m) => m.trim());
          }

          const objetivosFromUrl = query.get('objetivos');
          if (objetivosFromUrl) {
            this.filtroObjetivos = objetivosFromUrl.split(',').map((o) => o.trim());
          }

          const minPrecoFromUrl = query.get('minPreco');
          this.filtroPrecoMin = minPrecoFromUrl ? parseFloat(minPrecoFromUrl) : 0;

          const maxPrecoFromUrl = query.get('maxPreco');
          this.filtroPrecoMax = maxPrecoFromUrl ? parseFloat(maxPrecoFromUrl) : 999999;
        }

        // 🚀 PASSO 3: Inicia a busca com o estado atual da URL
        this.currentPage = 0;
        this.carregarProdutos();
      }
    );
  }

  limparFiltros() {
    this.termoDeBusca = undefined;
    this.filtroCategorias = [];
    this.filtroMarcas = [];
    this.filtroObjetivos = [];
    this.filtroPrecoMin = 0;
    this.filtroPrecoMax = 999999;
  }

  onFiltersChanged(event: {
    categorias: string[];
    marcas: string[];
    objetivos: string[];
    minPreco: number;
    maxPreco: number;
  }): void {
    // Este método agora apenas propaga os filtros do componente filho, que já atualiza a URL.
    // O `combineLatest` no `ngOnInit` irá detectar a mudança e chamar `carregarProdutos`
    // automaticamente, seguindo a nova lógica.
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

  carregarProdutos(): void {
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
        this.filtroObjetivos,
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

  proximaPagina(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.carregarProdutos();
    }
  }

  paginaAnterior(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.carregarProdutos();
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
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