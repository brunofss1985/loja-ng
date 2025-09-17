import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductFormComponent } from '../../admin/produto-form/produto-form.component';
import { Produto } from 'src/app/core/models/product.model';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';
import { ToastrService } from 'ngx-toastr';

// Interface para a resposta da API paginada
interface ProdutoResponse {
  content: Produto[];
  totalPages: number;
  totalElements: number;
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

  // ✅ Ajustado para usar `undefined` em vez de `null`
  produtoSelecionado: Produto | undefined = undefined;

  allProducts: Produto[] = [];
  modalAberto: boolean = false;
  isAdmin: boolean = false;
  columns: string[] = ['id', 'nome', 'categorias', 'preco'];
  columnLabels: { [key: string]: string } = {
    id: 'ID',
    nome: 'Nome',
    categorias: 'Categoria',
    preco: 'Preço',
  };

  // Paginação
  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 10;
  opcoesTamanhoPagina = [
    { nome: '10', valor: 10 },
    { nome: '20', valor: 20 },
    { nome: '30', valor: 30 },
    { nome: 'Todos', valor: 999999 },
  ];

  // Ordenação
  ordenacaoSelecionada: string = 'relevance';
  opcoesOrdenacao = [
    { nome: 'Relevância', valor: 'relevance' },
    { nome: 'Mais recentes', valor: 'dataCadastro,desc' },
    { nome: 'Menor preço', valor: 'preco,asc' },
    { nome: 'Maior preço', valor: 'preco,desc' },
    { nome: 'Produtos A-Z', valor: 'nome,asc' },
    { nome: 'Produtos Z-A', valor: 'nome,desc' },
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  onClickCadastrar(): void {
    this.novoProduto();
  }

  novoProduto(): void {
    this.produtoSelecionado = undefined;
    this.modalAberto = true;

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
      this.produtoSelecionado = undefined;
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

  onProdutoSalvo(produto: Produto): void {
    this.loadProducts();
    this.modalAberto = false;
  }

  loadProducts(): void {
    this.produtoService
      .buscarComFiltros(
        undefined,
        undefined,
        undefined,
        0,
        999999, // 🔥 traz todos os produtos
        0,
        999999,
        this.ordenacaoSelecionada
      )
      .subscribe({
        next: (data: ProdutoResponse) => {
          this.allProducts = data.content;
        },
        error: (err) => console.error('Erro ao carregar produtos:', err),
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
        this.loadProducts();
      },
      error: (error: any) => {
        this.toastr.error('Erro ao deletar produto');
        console.error('Erro ao deletar produto:', error);
      },
    });
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
      this.loadProducts();
    }
  }
}
