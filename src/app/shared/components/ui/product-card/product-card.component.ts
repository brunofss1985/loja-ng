// src/app/components/product-card/product-card.component.ts

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() productId!: number;
  @Input() productNome: string = '';
  @Input() productMarca: string = '';
  @Input() productModelo: string = '';
  @Input() productPeso: string = '';
  @Input() productImage?: string;
  @Input() productLink: string = '';
  @Input() productPreco: number = 0;
  @Input() productPrecoDesconto: number = 0;
  @Input() productPorcentagemDesconto: string = ''; // 🎯 CORREÇÃO: Tipo de volta para 'string'
  @Input() productDisponibilidade: string = '';
  @Input() productImagemMimeType: string = '';
  @Input() productImageMimeType?: string;
  @Input() productImagemBase64: string = '';
  @Input() productImageBase64?: string;



  // Novo método para retornar o preço principal a ser exibido
  getCurrentPrice(): number {
    return this.productPrecoDesconto > 0
      ? this.productPrecoDesconto
      : this.productPreco;
  }

  // 🎯 NOVO MÉTODO: Converte a porcentagem de string para number
  getPorcentagemNumerica(): number {
    const porcentagem = this.productPorcentagemDesconto;
    if (porcentagem && !isNaN(parseFloat(porcentagem))) {
      return parseFloat(porcentagem);
    }
    return 0;
  }

  get imageUrl(): string {
  if (this.productImage) {
    return this.productImage;
  }
  if (this.productImageBase64 && this.productImageMimeType) {
    return `data:${this.productImageMimeType};base64,${this.productImageBase64}`;
  }
  return 'assets/img/no-image.png';
}
}
