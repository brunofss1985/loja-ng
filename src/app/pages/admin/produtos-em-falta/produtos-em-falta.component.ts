import { Component, OnInit, ViewChild } from '@angular/core';
import { ProdutosEmFaltaFormComponent } from './produtos-em-falta-form/produtos-em-falta-form.component';
import { Produto } from 'src/app/core/models/product.model';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-produtos-em-falta',
  templateUrl: './produtos-em-falta.component.html',
  styleUrls: ['./produtos-em-falta.component.scss'],
})
export class ProdutosEmFaltaComponent implements OnInit {
  @ViewChild(ProdutosEmFaltaFormComponent)
  produtosEmFaltaFormComponent!: ProdutosEmFaltaFormComponent;

  allProducts: Produto[] = [];
  columns: string[] = ['id', 'nome', 'categoria', 'preco'];
  columnLabels: { [key: string]: string } = {
    id: 'ID',
    nome: 'Nome',
    categoria: 'Categoria',
    preco: 'Preco',
  };
  produto!: Produto;
  modalAberto: boolean = true;
  produtoSelecionado: any = null;

  constructor(private produtosService: ProdutosService) {}

  ngOnInit(): void {
    this.produtosService.getAllProdutos().subscribe({
      next: (data) => {
        this.allProducts = data;
      },
      error: (err) => console.error('Erro ao carregar usuários:', err),
    });
  }

  save() {
    if (this.produtosEmFaltaFormComponent) {
      this.produtosEmFaltaFormComponent.salvar();
    }
  }

  onProdutoSalvo() {
    this.produtosService.getAllProdutos().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.modalAberto = false;
        this.produtoSelecionado = null;
      },
      error: (err) => console.error('Erro ao atualizar a lista:', err),
    });
  }

  onEditProdutos(produto: Produto) {
    this.produtoSelecionado = produto;
    this.modalAberto = true;
  }

  onDeleteProducts(id: any) {
    if (confirm('Deseja realmente excluir este produto?')) {
      this.produtosService.deleteProduto(String(id)).subscribe(() => {
        this.produtosService.getAllProdutos().subscribe({
          next: (data) => (this.allProducts = data),
          error: (err) => console.error('Erro ao atualizar a lista:', err),
        });
      });
    }
  }
}
