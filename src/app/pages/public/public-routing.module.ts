import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicHomeComponent } from './public-home/public-home.component';
import { LoginComponent } from './login/login.component';
import { DefaultLoginComponent } from 'src/app/shared/components/ui/default-login/default-login.component';
import { RegisterComponent } from './register/register.component';
import { ListaProdutosComponent } from 'src/app/pages/public/lista-produtos/lista-produtos.component';
import { DetalheProdutoComponent } from 'src/app/pages/public/detalhe-produto/detalhe-produto.component';
import { PublicComponent } from './public.component';
import { CartComponent } from './cart-component/cart-component.component';
import { PaymentComponent } from 'src/app/pages/public/payment-component/payment-component.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PaymentResultComponent } from './payment-result/payment-result.component';
import { SessionExpiredGuard } from 'src/app/core/guards/sessionExpiredGuard';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      { path: '', component: PublicHomeComponent, canActivate: [SessionExpiredGuard] },
      { path: 'produtos', component: ListaProdutosComponent, canActivate: [SessionExpiredGuard] },
      { path: 'produtos/:categoria', component: ListaProdutosComponent, canActivate: [SessionExpiredGuard] },
      { path: 'produtos/buscar/:termo', component: ListaProdutosComponent, canActivate: [SessionExpiredGuard] },
      { path: 'produto/:id', component: DetalheProdutoComponent, canActivate: [SessionExpiredGuard] },
      { path: 'cart', component: CartComponent, canActivate: [SessionExpiredGuard] },
      { path: 'payment', component: PaymentComponent, canActivate: [SessionExpiredGuard] },
      { path: 'payment-result', component: PaymentResultComponent, canActivate: [SessionExpiredGuard] },
      { path: 'perfil', component: PerfilComponent, canActivate: [SessionExpiredGuard] },
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
