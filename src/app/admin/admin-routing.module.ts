import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CaixaComponent } from './pages/caixa/caixa.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { OrcamentosComponent } from './pages/orcamentos/orcamentos.component';
import { ProdutosEmFaltaComponent } from './pages/produtos-em-falta/produtos-em-falta.component';
import { AuthGuard } from '../auth/auth-guard/auth-guard';
import { AdminGuard } from '../auth/auth-guard/admin-guard';
import { PerfilAdminComponent } from './pages/perfil-admin/perfil-admin.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';

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
