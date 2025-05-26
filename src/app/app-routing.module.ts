import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './core/guards/admin-guard';

const routes: Routes = [
  { path: '', redirectTo: '/public', pathMatch: 'full' },
  { path: 'public', loadChildren: () => import('./pages/public/public.module').then((m) => m.PublicModule)},
  { path: 'user', loadChildren: () => import('./pages/user/user.module').then((m) => m.UserModule)},
  { path: 'admin', loadChildren: () => import('./pages/admin/admin.module').then((m) => m.AdminModule), canActivate: [AdminGuard], },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
