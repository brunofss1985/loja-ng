import { Component, OnInit } from '@angular/core';
import { Produtos, ProdutosService } from 'src/app/auth/services/produtosService/produtos.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
})
export class ProdutosComponent implements OnInit {
  tableName: string = 'Tabela de Produtos Cadastrados';
  headers: string[] = ['id', 'nome', 'marca', 'tipo', 'categoria', 'descricão'];
  isAdmin: boolean = false;

  produtos: any[] = [];
  novoProduto: Produtos = {
    nome: '',
    marca: '',
    categoria: '',
    tipo: '',
    descricao: ''
  };

  constructor(private produtosService: ProdutosService) { }

  ngOnInit(): void {
    this.getProdutos();
  }

  getProdutos(): void {
    this.produtosService.getAllProdutos().subscribe({
      next: (data) => {
        console.log('📦 Produtos recebidos:', data);
        this.produtos = data.map(prod => ({
          id: prod.id ? String(prod.id).slice(-4) : '', // corrigido aqui
          nome: prod.nome ?? '',
          marca: prod.marca ?? '',
          tipo: prod.tipo ?? '',
          categoria: prod.categoria ?? '',
          'descricão': prod.descricao ?? ''
        }));
      },
      error: (err) => console.error('❌ Erro ao carregar produtos:', err)
    });
  }

  createProduto(produto: Produtos): void {
    if (!produto.nome || !produto.marca) {
      console.warn('⚠️ Nome e marca são obrigatórios');
      return;
    }

    this.produtosService.createProduto(produto).subscribe(response => {
      console.log('✅ Produto criado com sucesso:', response);
      this.getProdutos();
      this.limparFormulario();
    });
  }

  limparFormulario(): void {
    this.novoProduto = {
      nome: '',
      marca: '',
      categoria: '',
      tipo: '',
      descricao: ''
    };
  }

  updateProduto(id: string, produto: Produtos): void {
    this.produtosService.updateProduto(id, produto).subscribe(response => {
      console.log('✏️ Produto atualizado:', response);
      this.getProdutos();
    });
  }

  deleteProduto(id: string): void {
    this.produtosService.deleteProduto(id).subscribe(() => {
      console.log('🗑️ Produto deletado com sucesso');
      this.getProdutos();
    });
  }
}
