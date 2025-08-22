import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  styleUrls: ['./lista-produtos.component.scss'],
})
export class ListaProdutosComponent implements OnInit {
  categoria!: any;
  produtos!: any[];
  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 10;

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutosService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.categoria = params['categoria'];
      // Sempre que a rota mudar, recomeça da primeira página
      this.currentPage = 0; 
      this.carregarProdutos();
    });
  }

  carregarProdutos() {
    if (this.categoria) {
      this.produtoService
        .buscarPorCategoriaPaginado(this.categoria, this.currentPage, this.pageSize)
        .subscribe((response) => {
          this.produtos = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
        });
    } else {
      this.produtoService
        .getAllProdutosPaginado(this.currentPage, this.pageSize)
        .subscribe((response) => {
          this.produtos = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
        });
    }
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
      this.carregarProdutos(); // Adicionado aqui a chamada para carregar os produtos
    }
  }
}
