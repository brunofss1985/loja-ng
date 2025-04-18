import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { MeusPedidosComponent } from './meus-pedidos/meus-pedidos.component';
import { PerfilUserComponent } from './perfil-user/perfil-user.component';
import { AuthGuard } from 'src/app/auth/auth-guard/auth-guard';
import { ProdutosComponent } from '../../public/visitor/produtos/produtos.component';

const routes: Routes = [
  {
    path: '', component: UserComponent, canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'perfil', pathMatch: 'full'},
      { path: 'meus-pedidos', component: MeusPedidosComponent },
      { path: 'perfil', component: PerfilUserComponent },
      { path: 'produtos', component: ProdutosComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
