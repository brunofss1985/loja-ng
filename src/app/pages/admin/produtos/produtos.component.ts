// src/app/pages/admin/produtos/produtos.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductFormComponent } from './produto-form/produto-form.component';
import { Produto } from 'src/app/core/models/product.model';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';
import { ToastrService } from 'ngx-toastr';

// Interface para a resposta da API paginada
interface ProdutoResponse {
  content: Produto[];
  totalPages: number;
  totalElements: number;
  // Outros metadados de paginação que a API do Spring envia
  last: boolean;
  first: boolean;
  number: number;
  size: number;
  numberOfElements: number;
}

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
})
export class ProdutosComponent implements OnInit {
  @ViewChild(ProductFormComponent) productFormComponent!: ProductFormComponent;

  constructor(
    private produtoService: ProdutosService,
    private toastr: ToastrService
  ) {}

  produtoSelecionado: any = null;
  allProducts: Produto[] = [];
  modalAberto: boolean = false;
  isAdmin: boolean = false;
  columns: string[] = ['id', 'nome', 'categorias', 'preco'];
  columnLabels: { [key: string]: string } = {
    id: 'ID',
    nome: 'Nome',
    categorias: 'Categoria',
    preco: 'Preco',
  };

  // Variáveis para paginação
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;

  ngOnInit(): void {
    this.loadProducts();
  }

  novoProduto(): void {
    this.produtoSelecionado = undefined;
    this.modalAberto = true;

    // Resetar o formulário se estiver carregado
    setTimeout(() => {
      if (this.productFormComponent) {
        this.productFormComponent.resetFormToDefaults();
      }
    }, 0);
  }

  onModalAbertoChange(valor: boolean): void {
    this.modalAberto = valor;

    if (!valor && this.productFormComponent) {
      this.productFormComponent.resetFormToDefaults();
      this.produtoSelecionado = null;
    }
  }

  save() {
    if (this.productFormComponent) {
      this.productFormComponent.submit();
    }
  }

  onEditProduct(produto: Produto) {
    this.produtoSelecionado = produto;
    this.modalAberto = true;
  }

  onProdutoSalvo(produto: any): void {
    this.loadProducts(); // Atualiza a tabela
    this.modalAberto = false; // Fecha o modal
  }

  loadProducts(): void {
    // ✅ CORREÇÃO APLICADA: Incluído um 'undefined' como terceiro argumento
    this.produtoService
      .buscarComFiltros(undefined, undefined, undefined, 0, 999999, this.currentPage, this.pageSize)
      .subscribe({
        next: (data: ProdutoResponse) => {
          this.allProducts = data.content;
          this.totalPages = data.totalPages;
          // As propriedades de paginação agora vêm do objeto de resposta `data`
        },
        error: (err: any) => console.error('Erro ao carregar produtos:', err),
      });
  }

  onProductsRegistered() {
    this.loadProducts();
    this.modalAberto = false;
  }

  onDeleteProducts(id: any) {
    const confirmar = confirm('Tem certeza que deseja deletar este item?');
    if (!confirmar) return;

    this.produtoService.deleteProduto(id).subscribe({
      next: () => {
        this.toastr.success(`Produto ${id} deletado com sucesso`);
        this.loadProducts(); // Atualiza a lista
      },
      error: (error: any) => {
        this.toastr.error('Erro ao deletar produto');
        console.error('Erro ao deletar produto:', error);
      },
    });
  }

  // Métodos de paginação
  proximaPagina(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  paginaAnterior(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProducts();
    }
  }
}