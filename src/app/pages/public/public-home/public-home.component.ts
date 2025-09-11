import { Component, OnInit } from '@angular/core';
import { Produto } from 'src/app/core/models/product.model';
import { ProdutosService, PaginatedResponse } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-public-home',
  templateUrl: './public-home.component.html',
  styleUrls: ['./public-home.component.scss'],
})
export class PublicHomeComponent implements OnInit {
  produtosEmDestaque: Produto[] = [];
  isLoading: boolean = true;
  hasError: boolean = false;

  currentIndex: number = 0;
  visibleCards: number = 4;

  isPrevDisabled: boolean = true;
  isNextDisabled: boolean = false;

  constructor(private produtosService: ProdutosService) {}

  ngOnInit(): void {
    this.carregarProdutosEmDestaque();
    this.definirCardsVisiveis();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize(): void {
    this.definirCardsVisiveis();
    this.updateButtonStates();
  }

  carregarProdutosEmDestaque(): void {
    this.isLoading = true;
    this.hasError = false;

    this.produtosService.buscarProdutosEmDestaque(0, 20).subscribe({
      next: (response: PaginatedResponse<Produto>) => {
        this.produtosEmDestaque = response.content || [];
        this.isLoading = false;
        this.updateButtonStates();
      },
      error: (err) => {
        console.error('Erro ao carregar produtos em destaque:', err);
        this.isLoading = false;
        this.hasError = true;
        this.updateButtonStates();
      },
    });
  }

  definirCardsVisiveis(): void {
    const largura = window.innerWidth;
    if (largura < 600) {
      this.visibleCards = 1;
    } else if (largura < 900) {
      this.visibleCards = 2;
    } else if (largura < 1200) {
      this.visibleCards = 3;
    } else {
      this.visibleCards = 4;
    }
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateButtonStates();
    }
  }

  nextSlide(): void {
    if (this.currentIndex < this.produtosEmDestaque.length - this.visibleCards) {
      this.currentIndex++;
      this.updateButtonStates();
    }
  }

  getTransform(): string {
    const cardWidth = 100 / this.visibleCards;
    return `translateX(-${this.currentIndex * cardWidth}%)`;
  }

  updateButtonStates(): void {
    this.isPrevDisabled = this.currentIndex === 0;
    this.isNextDisabled = this.currentIndex >= this.produtosEmDestaque.length - this.visibleCards;
  }
}
