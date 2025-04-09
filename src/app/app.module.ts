import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './visitor/pages/home-visitor/home-visitor.component';
import { HomeUserComponent } from './user/pages/home-user/home-user.component';
import { SidebarModule } from './shared/sidebar/sidebar.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapComponent } from './shared/map/map.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptor } from './auth/interceptors/token.interceptor';
import { ProdutosComponent } from './visitor/pages/produtos/produtos.component';
import { ProdutoDetalheComponent } from './visitor/pages/produto-detalhe/produto-detalhe.component';
import { EstoqueComponent } from './admin/pages/estoque/estoque.component';
import { ComprasComponent } from './admin/pages/compras/compras.component';
import { ProdutosEmFaltaComponent } from './admin/pages/produtos-em-falta/produtos-em-falta.component';
import { OrcamentosComponent } from './admin/pages/orcamentos/orcamentos.component';
import { CaixaComponent } from './admin/pages/caixa/caixa.component';
import { AcessoNegadoComponent } from './shared/acesso-negado/acesso-negado.component';
import { PaginaNaoEncontradaComponent } from './shared/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { LoginComponent } from './visitor/pages/login/login.component';
import { RegisterComponent } from './visitor/pages/register/register.component';
import { PerfilAdminComponent } from './admin/pages/perfil-admin/perfil-admin.component';

@NgModule({
  declarations: [
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    AppComponent,
    PerfilAdminComponent,
    HomeUserComponent,
    MapComponent,
    ProdutosComponent,
    ProdutoDetalheComponent,
    EstoqueComponent,
    ComprasComponent,
    ProdutosEmFaltaComponent,
    OrcamentosComponent,
    CaixaComponent,
    AcessoNegadoComponent,
    PaginaNaoEncontradaComponent
    
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
