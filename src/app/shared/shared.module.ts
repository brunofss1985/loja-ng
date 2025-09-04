import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { DefaultLoginComponent } from './components/ui/default-login/default-login.component';
import { RouterModule } from '@angular/router';
import { TablesComponent } from './components/layout/tables/tables.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { InputTextComponent } from './components/ui/input-text/input-text.component';
import { ModalComponent } from './components/ui/modal/modal.component';
import { DeleteButtonComponent } from './components/ui/delete-button/delete-button.component';
import { EditButtonComponent } from './components/ui/edit-button/edit-button.component';
import { ListaProdutosComponent } from '../pages/public/lista-produtos/lista-produtos.component';
import { DetalheProdutoComponent } from '../pages/public/detalhe-produto/detalhe-produto.component';
import { ProductCardComponent } from './components/ui/product-card/product-card.component';
import { PaymentComponent } from '../pages/public/payment-component/payment-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltroComponent } from '../pages/public/filtro/filtro.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DefaultLoginComponent,
    InputTextComponent,
    TablesComponent,
    SidebarComponent,
    ModalComponent,
    DeleteButtonComponent,
    EditButtonComponent,
    ListaProdutosComponent,
    DetalheProdutoComponent,
    ProductCardComponent,
    PaymentComponent,
    FiltroComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule ,
    FormsModule,           // <- Esse aqui resolve o ngModel
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    DefaultLoginComponent,
    InputTextComponent,
    TablesComponent,
    SidebarComponent,
    ModalComponent,
    DeleteButtonComponent,
    ListaProdutosComponent,
    DetalheProdutoComponent,
    ProductCardComponent
  ]
})
export class SharedModule { }
