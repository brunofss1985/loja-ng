import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { CaixaComponent } from './caixa/caixa.component';
import { ComprasComponent } from './compras/compras.component';
import { EstoqueComponent } from './estoque/estoque.component';
import { OrcamentosComponent } from './orcamentos/orcamentos.component';
import { PerfilAdminComponent } from './perfil-admin/perfil-admin.component';
// import { ProdutosEmFaltaComponent } from './produtos-em-falta/produtos-em-falta.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PublicModule } from '../public/public.module';
import { ProdutosComponent } from '../public/produtos/produtos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductFormComponent } from './produto-form/produto-form.component';
import { ValidadeAlertaComponent } from './validade-alerta/validade-alerta.component';
import { MovimentacoesComponent } from './movimentações/movimentacoes.component';
import { LotesComponent } from './lotes/lotes.component';
// import { ProdutosEmFaltaFormComponent } from './produtos-em-falta/produtos-em-falta-form/produtos-em-falta-form.component';

@NgModule({
  declarations: [
    AdminHomeComponent,
    CaixaComponent,
    ComprasComponent,
    EstoqueComponent,
    OrcamentosComponent,
    PerfilAdminComponent,
    // ProdutosEmFaltaComponent,
    UsuariosComponent,
    ProdutosComponent,
    ProductFormComponent,
    // ProdutosEmFaltaFormComponent
    ValidadeAlertaComponent,
    MovimentacoesComponent,
    LotesComponent
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    PublicModule,
    ReactiveFormsModule,
    FormsModule
    
  ]
})
export class AdminModule { }
