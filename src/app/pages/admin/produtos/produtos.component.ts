import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductFormComponent } from './produto-form/produto-form.component';
import { Produto } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
})
export class ProdutosComponent implements OnInit {

  @ViewChild(ProductFormComponent) productFormComponent!: ProductFormComponent;

  constructor() {}

  ngOnInit(): void {}

  save() {
    console.log('ok1');
    this.productFormComponent.submit()
  }
  
  onProdutoSalvo(produto: Produto): void {
    console.log('ok2', produto);
  }
  
}
