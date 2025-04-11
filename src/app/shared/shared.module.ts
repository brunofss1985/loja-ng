import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteButtonComponent } from './delete-button/delete-button.component';
import { AcessoNegadoComponent } from './acesso-negado/acesso-negado.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TablesComponent } from './tables/tables.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    DeleteButtonComponent,
    AcessoNegadoComponent,
    PaginaNaoEncontradaComponent,
    SidebarComponent,
    TablesComponent

  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    RouterModule
  ],
  exports: [
    DeleteButtonComponent,
    AcessoNegadoComponent,
    PaginaNaoEncontradaComponent,
    SidebarComponent,
    TablesComponent
  ]
})
export class SharedModule { }
