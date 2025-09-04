// src/app/pages/public/detalhe-produto/detalhe-produto.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartItem } from 'src/app/core/models/cart-item.model';
import { CartService } from 'src/app/core/services/cartService/cart-service.service';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-detalhe-produto',
  templateUrl: './detalhe-produto.component.html',
  styleUrls: ['./detalhe-produto.component.scss'],
})
export class DetalheProdutoComponent implements OnInit {
  @Input() produto: any;
  imagemSelecionada: string = '';

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutosService,
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarProdutoPorId(id);
    } else if (this.produto) {
      this.selecionarImagemPrincipal();
    }
  }

  carregarProdutoPorId(id: string) {
    this.produtoService.buscarPorId(id).subscribe({
      next: (res: any) => {
        this.produto = res;
        this.selecionarImagemPrincipal();
      },
      error: (err: any) => console.error('Erro ao buscar produto:', err),
    });
  }

  selecionarImagemPrincipal() {
    if (this.produto?.imagem && this.produto?.imagemMimeType) {
      this.imagemSelecionada = `data:${this.produto.imagemMimeType};base64,${this.produto.imagem}`;
    } else {
      this.imagemSelecionada = '';
    }
  }

  selecionarImagem(imagem: string, mimeType: string) {
    this.imagemSelecionada = `data:${mimeType};base64,${imagem}`;
  }

  selecionarImagemGaleria(imagem: string, mimeType: string) {
    this.selecionarImagem(imagem, mimeType);
  }

  calcularDesconto(precoAtual: any, precoAntigo: any) {
    if (!precoAntigo || precoAntigo <= precoAtual) return 0;
    return Math.round(((precoAntigo - precoAtual) / precoAntigo) * 100);
  }

  addToCart(): void {
    if (!this.produto) return;

    const price = Number(this.produto.preco) || 0;

    const icon =
      this.imagemSelecionada ||
      (this.produto.imagem && this.produto.imagemMimeType
        ? `data:${this.produto.imagemMimeType};base64,${this.produto.imagem}`
        : 'https://via.placeholder.com/64');

    const item: CartItem = {
      id: Number(this.produto.id),
      name: this.produto.nome,
      description: this.produto.descricaoCurta || this.produto.marca || '',
      price,
      quantity: 1,
      icon,
    };

    this.cartService.addToCart(item);

    // ✅ Toast com ngx-toastr
    this.toastr.success('Produto adicionado ao carrinho!', 'Sucesso', {
      timeOut: 3000,
      positionClass: 'toast-top-right',
    });
  }

  addTocartAndNavigte(){
    this.addToCart()
    this.router.navigate(['/cart']);
  }
}
