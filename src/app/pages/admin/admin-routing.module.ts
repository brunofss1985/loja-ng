import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { OrcamentosComponent } from './orcamentos/orcamentos.component';
import { PerfilAdminComponent } from './perfil-admin/perfil-admin.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AdminGuard } from 'src/app/core/guards/admin-guard';
import { ProdutosComponent } from '../public/produtos/produtos.component';
import { MovimentacoesComponent } from './movimentações/movimentacoes.component';
import { ValidadeAlertaComponent } from './validade-alerta/validade-alerta.component';
import { LotesComponent } from './lotes/lotes.component';

import { AdminPedidosComponent } from './admin-pedidos/admin-pedidos.component';
import { AdminPedidoDetalhesComponent } from './admin-pedido-detalhes/admin-pedido-detalhes.component';

const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'perfil', component: PerfilAdminComponent },
      { path: 'orcamentos', component: OrcamentosComponent },
      { path: 'produtos', component: ProdutosComponent },
      { path: 'movimentacoes', component: MovimentacoesComponent },
      { path: 'validade-alerta', component: ValidadeAlertaComponent },
      { path: 'lotes', component: LotesComponent },

      // 👨‍💼 Novas rotas de pedidos admin:
      { path: 'pedidos', component: AdminPedidosComponent },
      { path: 'pedidos/:id', component: AdminPedidoDetalhesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
