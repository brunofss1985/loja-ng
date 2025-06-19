import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-detalhe-produto',
  templateUrl: './detalhe-produto.component.html',
  styleUrls: ['./detalhe-produto.component.scss']
})
export class DetalheProdutoComponent implements OnInit {

  @Input() produto: any;
  imagemSelecionada: string = '';

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutosService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarProdutoPorId(id);
    } else if (this.produto) {
      this.setImagemPrincipal();
    }
  }

  carregarProdutoPorId(id: string) {
    this.produtoService.buscarPorId(id).subscribe({
      next: (res: any) => {
        this.produto = res;
        this.setImagemPrincipal();
      },
      error: (err: any) => {
        console.error('Erro ao buscar produto:', err);
      }
    });
  }

  setImagemPrincipal() {
    if (this.produto.imagem && this.produto.imagemMimeType) {
      this.imagemSelecionada = 'data:' + this.produto.imagemMimeType + ';base64,' + this.produto.imagem;
    } else {
      this.imagemSelecionada = '';
    }
  }

  selecionarImagem(imagem: string, mimeType: string) {
    this.imagemSelecionada = 'data:' + mimeType + ';base64,' + imagem;
  }

  selecionarImagemGaleria(imagem: string, mimeType: string) {
    this.selecionarImagem(imagem, mimeType);
  }
}
