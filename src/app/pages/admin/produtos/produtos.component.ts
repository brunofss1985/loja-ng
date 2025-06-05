import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductFormComponent } from './produto-form/produto-form.component';
import { Produto } from 'src/app/core/models/product.model';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';
import { ToastrService } from 'ngx-toastr';

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

  modalAberto: boolean = true;

  isAdmin: boolean = false;
  columns: string[] = ['id', 'nome', 'categoria', 'preco'];
  columnLabels: { [key: string]: string } = {
    id: 'ID',
    nome: 'Nome',
    categoria: 'Categoria',
    preco: 'Preco',
  };

  ngOnInit(): void {
    this.loadProducts();
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
    this.produtoService.getAllProdutos().subscribe({
      next: (data) => {
        this.allProducts = data;
      },
      error: (err) => console.error('Erro ao carregar usuários:', err),
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
        this.toastr.success(`Usuário ${id} deletado com sucesso`);
        this.loadProducts(); // Atualiza a lista
      },
      error: (error) => {
        this.toastr.error('Erro ao deletar usuário');
        console.error('Erro ao deletar usuário:', error);
      },
    });
  }
}
