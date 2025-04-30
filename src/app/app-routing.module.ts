import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitorComponent } from './pages/public/visitor/visitor.component';
import { AcessoNegadoComponent } from './shared/acesso-negado/acesso-negado.component';

const routes: Routes = [

  { path: '', component: VisitorComponent },
  { path: '', redirectTo: '/visitor', pathMatch: 'full' },
  { path: 'acesso-negado', component: AcessoNegadoComponent },
  { path: 'visitor', loadChildren: () => import('./pages/public/visitor/visitor.module').then(m => m.VisitorModule) },
  { path: 'user', loadChildren: () => import('./pages/private/user/user.module').then(m => m.UserModule) },
  { path: 'admin', loadChildren: () => import('./pages/private/admin/admin.module').then(m => m.AdminModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
