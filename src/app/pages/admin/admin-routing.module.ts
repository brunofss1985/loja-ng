import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { CaixaComponent } from './caixa/caixa.component';
import { ComprasComponent } from './compras/compras.component';
import { EstoqueComponent } from './estoque/estoque.component';
import { OrcamentosComponent } from './orcamentos/orcamentos.component';
import { PerfilAdminComponent } from './perfil-admin/perfil-admin.component';
// import { ProdutosEmFaltaComponent } from './produtos-em-falta/produtos-em-falta.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AdminGuard } from 'src/app/core/guards/admin-guard';
import { ProdutosComponent } from '../public/produtos/produtos.component';
import { MovimentacoesComponent } from './movimentações/movimentacoes.component';
import { ValidadeAlertaComponent } from './validade-alerta/validade-alerta.component';
import { LotesComponent } from './lotes/lotes.component';

const routes: Routes = [
  {path: '', component: AdminHomeComponent,
    canActivateChild: [AdminGuard], 
    children: [
     { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'perfil', component: PerfilAdminComponent },
      { path: 'caixa', component: CaixaComponent },
      { path: 'compras', component: ComprasComponent },
      { path: 'estoque', component: EstoqueComponent },
      { path: 'orcamentos', component: OrcamentosComponent },
      { path: 'produtos', component: ProdutosComponent },
      { path: 'movimentacoes', component: MovimentacoesComponent },
      { path: 'validade-alerta', component: ValidadeAlertaComponent },
      { path: 'lotes', component: LotesComponent },
      // { path: 'produtos-em-falta', component: ProdutosEmFaltaComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
