import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicHomeComponent } from './public-home/public-home.component';
import { LoginComponent } from './login/login.component';
import { DefaultLoginComponent } from 'src/app/shared/components/default-login/default-login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: PublicHomeComponent },
  { path: 'default-login', component: DefaultLoginComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
