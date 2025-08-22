import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DefaultLoginComponent } from './components/default-login/default-login.component';
import { RouterModule } from '@angular/router';
import { TablesComponent } from './components/tables/tables.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { ModalComponent } from './components/modal/modal.component';
import { DeleteButtonComponent } from './components/delete-button/delete-button.component';
import { EditButtonComponent } from './components/edit-button/edit-button.component';
import { ListaProdutosComponent } from './components/produtos/lista-produtos/lista-produtos.component';
import { DetalheProdutoComponent } from './components/produtos/detalhe-produto/detalhe-produto.component';
import { ProductCardComponent } from './components/produtos/product-card/product-card.component';
import { PaymentComponent } from './components/payment-component/payment-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltroComponent } from './components/produtos/filtro/filtro.component';

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
