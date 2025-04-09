import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SidebarModule } from "../shared/sidebar/sidebar.module";
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { TablesModule } from '../shared/tables/tables.module';

@NgModule({
  declarations: [
    AdminComponent,
    UsuariosComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SidebarModule,
    TablesModule
]
})
export class AdminModule { }
