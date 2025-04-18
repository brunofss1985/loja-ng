import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../auth/auth-guard/auth-guard';
import { AdminGuard } from '../../../auth/auth-guard/admin-guard';
import { AdminComponent } from './admin.component';
import { CaixaComponent } from './caixa/caixa.component';
import { ComprasComponent } from './compras/compras.component';
import { EstoqueComponent } from './estoque/estoque.component';
import { OrcamentosComponent } from './orcamentos/orcamentos.component';
import { PerfilAdminComponent } from './perfil-admin/perfil-admin.component';
import { ProdutosEmFaltaComponent } from './produtos-em-falta/produtos-em-falta.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProdutosComponent } from '../../public/visitor/produtos/produtos.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent, canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'perfil', component: PerfilAdminComponent },
      { path: 'caixa', component: CaixaComponent },
      { path: 'compras', component: ComprasComponent },
      { path: 'estoque', component: EstoqueComponent },
      { path: 'orcamentos', component: OrcamentosComponent },
      { path: 'produtos-em-falta', component: ProdutosEmFaltaComponent },
      { path: 'produtos', component: ProdutosComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
