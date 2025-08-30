import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  styleUrls: ['./lista-produtos.component.scss'],
})
export class ListaProdutosComponent implements OnInit {
  termoDeBusca?: string;
  categoria?: string;
  marca?: string; // ✅ NOVO: suporte a marca via rota
  produtos!: any[];
  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;

  // Quantidade por página
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
  filtroPrecoMin: number = 0;
  filtroPrecoMax: number = 999999;

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutosService
  ) {}

  ngOnInit(): void {
    // Observa params + queryParams ao mesmo tempo (sem quebrar o fluxo antigo)
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      ([params, query]) => {
        this.termoDeBusca = params.get('termo') || undefined;
        this.categoria = params.get('categoria') || undefined;

        // ✅ NOVO: marca via rota opcional (/produtos/marca/:marca)
        this.marca = params.get('marca') || undefined;

        // Reseta filtros ao mudar de rota/query
        this.filtroCategorias = [];
        this.filtroMarcas = [];
        this.filtroPrecoMin = 0;
        this.filtroPrecoMax = 999999;

        if (this.categoria) {
          this.filtroCategorias.push(this.categoria);
        }

        // ✅ NOVO: marca via rota tem prioridade
        if (this.marca) {
          this.filtroMarcas.push(this.marca);
        } else {
          // ✅ NOVO: marca via query param (?marca=Nome)
          const qpMarca = query.get('marca');
          if (qpMarca) {
            this.filtroMarcas.push(qpMarca);
          }

          // (Opcional) múltiplas marcas/categorias por query param (?marcas=A,B&categorias=X,Y)
          const qpMarcas = query.getAll('marcas'); // suporta repetidos
          qpMarcas.forEach((m) => {
            m.split(',').forEach((part) => {
              const t = part.trim();
              if (t && !this.filtroMarcas.includes(t)) this.filtroMarcas.push(t);
            });
          });

          const qpCategorias = query.getAll('categorias');
          qpCategorias.forEach((c) => {
            c.split(',').forEach((part) => {
              const t = part.trim();
              if (t && !this.filtroCategorias.includes(t)) this.filtroCategorias.push(t);
            });
          });
        }

        this.currentPage = 0;
        this.carregarProdutos();
      }
    );
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

    // Mantém a lógica antiga: busca por termo é ignorada quando filtros mudam
    this.termoDeBusca = undefined;
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
      // Inclui marcas no filtro (💡 já estava, só garantimos o preenchimento acima)
      produtoObservable = this.produtoService.buscarComFiltros(
        this.filtroCategorias,
        this.filtroMarcas,
        [], // objetivos (mantido)
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
