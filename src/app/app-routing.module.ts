import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './core/guards/admin-guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/public/public.module').then((m) => m.PublicModule)},
  { path: 'admin', loadChildren: () => import('./pages/admin/admin.module').then((m) => m.AdminModule), canActivate: [AdminGuard], },
  { path: '**',  redirectTo: 'public/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
