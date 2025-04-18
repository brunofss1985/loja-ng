import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptor } from './auth/interceptors/token.interceptor';
import { EstoqueComponent } from './pages/private/admin/estoque/estoque.component';
import { ProdutosEmFaltaComponent } from './pages/private/admin/produtos-em-falta/produtos-em-falta.component';
import { OrcamentosComponent } from './pages/private/admin/orcamentos/orcamentos.component';
import { PerfilAdminComponent } from './pages/private/admin/perfil-admin/perfil-admin.component';
import { SharedModule } from './shared/shared.module';
import { CaixaComponent } from './pages/private/admin/caixa/caixa.component';
import { ComprasComponent } from './pages/private/admin/compras/compras.component';
import { HomeUserComponent } from './pages/private/user/home-user/home-user.component';
import { HomeComponent } from './pages/public/visitor/home/home.component';
import { LoginComponent } from './pages/public/visitor/login/login.component';
import { ProdutoDetalheComponent } from './pages/public/visitor/produto-detalhe/produto-detalhe.component';
import { RegisterComponent } from './pages/public/visitor/register/register.component';
import { ProdutosComponent } from './pages/public/visitor/produtos/produtos.component';

@NgModule({
  declarations: [
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    AppComponent,
    PerfilAdminComponent,
    HomeUserComponent,
    ProdutoDetalheComponent,
    EstoqueComponent,
    ComprasComponent,
    ProdutosEmFaltaComponent,
    OrcamentosComponent,
    CaixaComponent,
    
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
    BrowserAnimationsModule,
    SharedModule,
    RouterModule.forRoot([]),
    ToastrModule.forRoot(),
  ],
  providers: [ 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
