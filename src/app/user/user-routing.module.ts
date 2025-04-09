import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { MeusPedidosComponent } from './pages/meus-pedidos/meus-pedidos.component';
import { PerfilUserComponent } from './pages/perfil-user/perfil-user.component';
import { AuthGuard } from '../auth/auth-guard/auth-guard';

const routes: Routes = [
  {
    path: '', component: UserComponent, canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'perfil', pathMatch: 'full'},
      { path: 'meus-pedidos', component: MeusPedidosComponent },
      { path: 'perfil', component: PerfilUserComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
