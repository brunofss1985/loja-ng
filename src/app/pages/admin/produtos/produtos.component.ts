import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductFormComponent } from './produto-form/produto-form.component';
import { Produto } from 'src/app/core/models/product.model';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
})
export class ProdutosComponent implements OnInit {
  @ViewChild(ProductFormComponent) productFormComponent!: ProductFormComponent;

  constructor(private produtoService: ProdutosService) {}

  allProducts: Produto[] = [];

  modalAberto!: boolean;

  isAdmin: boolean = false;
  headers: string[] = ['id', 'nome', 'categoria', 'preco'];
  headerLabels: { [key: string]: string } = {
    id: 'ID',
    nome: 'Nome',
    categoria: 'Categoria',
    preco: 'Preco',
  };

  ngOnInit(): void {
      this.loadProducts();
  }

  save() {
    this.productFormComponent.submit();
  }

  onProdutoSalvo(produto: Produto): void {
    this.produtoService.createProduto(produto);
    this.loadProducts(); // Atualiza a tabela
    this.modalAberto = false; // Fecha o modal
  }

  loadProducts(): void {
    this.produtoService.getAllProdutos().subscribe({
      next: (data) => {
        this.allProducts = data;
        console.log(this.allProducts);
      },
      error: (err) => console.error('Erro ao carregar usuários:', err),
    });
  }

  onProductsRegistered() {
    this.loadProducts(); // Atualiza a tabela
    this.modalAberto = false; // Fecha o modal
  }
}
