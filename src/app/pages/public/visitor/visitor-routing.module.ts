import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitorComponent } from './visitor.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from '../../../shared/register/register.component';
import { RegisterGuard } from 'src/app/auth/auth-guard/register-guard';

const routes: Routes = [
  { path: '', component: VisitorComponent },
  { path: 'login', component: LoginComponent,  canActivate: [RegisterGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [RegisterGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitorRoutingModule { }
