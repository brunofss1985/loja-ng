import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { MeusPedidosComponent } from './meus-pedidos/meus-pedidos.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AuthGuard } from '../auth/auth-guard/auth-guard';

const routes: Routes = [
  {
    path: '', component: UserComponent, canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'meus-pedidos', pathMatch: 'full'},
      { path: 'meus-pedidos', component: MeusPedidosComponent },
      { path: 'perfil', component: PerfilComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
