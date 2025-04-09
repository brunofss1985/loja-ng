import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitorComponent } from './visitor/visitor.component';

const routes: Routes = [

  { path: '', component: VisitorComponent },
  { path: '', redirectTo: '/visitor', pathMatch: 'full' },
  { path: 'visitor', loadChildren: () => import('./visitor/visitor.module').then(m => m.VisitorModule) },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
