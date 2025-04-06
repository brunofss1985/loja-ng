import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './visitor/home.component';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { HomeUserComponent } from './user/home-user/home-user.component';
import { SidebarModule } from './shared/sidebar/sidebar.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapComponent } from './visitor/map/map.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    AppComponent,
    HomeAdminComponent,
    HomeUserComponent,
    MapComponent
    
  ],
  imports: [
    GoogleMapsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    SidebarModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([]),
    ToastrModule.forRoot(),
  ],
  providers: [ 
],
  bootstrap: [AppComponent]
})
export class AppModule { }
