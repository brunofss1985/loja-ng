import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicHomeComponent } from './public-home/public-home.component';
import { LoginComponent } from './login/login.component';
import { DefaultLoginComponent } from 'src/app/shared/components/default-login/default-login.component';
import { RegisterComponent } from './register/register.component';
import { ListaProdutosComponent } from 'src/app/shared/components/produtos/lista-produtos/lista-produtos.component';
import { DetalheProdutoComponent } from 'src/app/shared/components/produtos/detalhe-produto/detalhe-produto.component';
import { PublicComponent } from './public.component';
import { CartComponent } from './cart-component/cart-component.component';
import { PaymentComponent } from 'src/app/shared/components/payment-component/payment-component.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PaymentResultComponent } from './payment-result/payment-result.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      { path: '', component: PublicHomeComponent },
      { path: 'produtos', component: ListaProdutosComponent },
      { path: 'produtos/:categoria', component: ListaProdutosComponent },
      { path: 'produto/:id', component: DetalheProdutoComponent },
      { path: 'cart', component: CartComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'payment-result', component: PaymentResultComponent },
      { path: 'perfil', component: PerfilComponent },
    ],
  },
  {
    path: 'default-login',
    component: DefaultLoginComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
