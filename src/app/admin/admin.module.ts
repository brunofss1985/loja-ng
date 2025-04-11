import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { SharedModule } from '../shared/shared.module';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AdminComponent,
    UsuariosComponent,
    ProdutosComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    AdminRoutingModule,
    SharedModule
]
})
export class AdminModule { }
