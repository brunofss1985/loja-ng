import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitorComponent } from './visitor.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from '../../../shared/register/register.component';
import { RegisterGuard } from 'src/app/auth/auth-guard/register-guard';
import { DefaultLoginComponent } from 'src/app/shared/default-login/default-login.component';
import { AuthGuard } from 'src/app/auth/auth-guard/auth-guard';
import { RedirectIfAuthenticatedGuard } from 'src/app/auth/auth-guard/redirectIf-authenticated-guard';

const routes: Routes = [
  { path: '', component: VisitorComponent },
  {
    path: 'default-login', component: DefaultLoginComponent, canActivate: [RegisterGuard, RedirectIfAuthenticatedGuard],
    children: [
      { path: 'login', component: LoginComponent, canActivate: [RegisterGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [RegisterGuard] },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitorRoutingModule { }
