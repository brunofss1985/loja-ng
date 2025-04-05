import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './visitor/home.component';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { AuthGuard } from './auth/auth-guard/auth-guard';
import { HomeUserComponent } from './user/home-user/home-user.component';
import { MapComponent } from './visitor/map/map.component';

const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'home-admin',
    component: HomeAdminComponent,
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'home-user',
    component: HomeUserComponent,
    canActivate: [AuthGuard]
  } ,
  {
    path: 'map',
    component: MapComponent,
    
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
