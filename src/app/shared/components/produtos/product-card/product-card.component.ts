import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() productId!: number;
  @Input() productNome: string = '';
  @Input() productMarca: string = '';
  @Input() productModelo: string = '';
  @Input() productPeso: string = '';
  @Input() productImage: string = '';
  @Input() productLink: string = '';
  @Input() productPreco: string = '';
  @Input() productPrecoDesconto: string = '';
  @Input() productPorcentagemDesconto: string = ''; // ✨ Novo Input adicionado
}