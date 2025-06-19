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

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutosService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.categoria = params['categoria'];
      if (this.categoria) {
        this.carregarProdutos();
      } else {
        this.allProdutos();
      }
    });
  }

  carregarProdutos() {
    this.produtoService
      .buscarPorCategoria(this.categoria)
      .subscribe((produtos) => {
        this.produtos = produtos;
      });
  }

  allProdutos() {
    this.produtoService.getAllProdutos().subscribe((res) => {
      this.produtos = res;
    });
  }
}
