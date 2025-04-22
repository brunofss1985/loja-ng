import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteButtonComponent } from './delete-button/delete-button.component';
import { AcessoNegadoComponent } from './acesso-negado/acesso-negado.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TablesComponent } from './tables/tables.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { DefaultLoginComponent } from './default-login/default-login.component';
import { InputTextComponent } from './input-text/input-text.component';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './modal/modal.component';
import { RegisterComponent } from './register/register.component';



@NgModule({
  declarations: [
    // RegisterComponent,
    DeleteButtonComponent,
    AcessoNegadoComponent,
    PaginaNaoEncontradaComponent,
    SidebarComponent,
    TablesComponent,
    DefaultLoginComponent,
    InputTextComponent,
    ModalComponent
  ],

  imports: [
    FormsModule,
    CommonModule,
    GoogleMapsModule,
    RouterModule,
    ReactiveFormsModule
  ],

  exports: [
    // RegisterComponent,
    DeleteButtonComponent,
    AcessoNegadoComponent,
    PaginaNaoEncontradaComponent,
    SidebarComponent,
    TablesComponent,
    DefaultLoginComponent,
    InputTextComponent,
    ModalComponent
  ]
})
export class SharedModule { }
