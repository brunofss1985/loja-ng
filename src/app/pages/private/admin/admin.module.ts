import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

@NgModule({
  declarations: [
    AdminComponent,
    UsuariosComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    AdminRoutingModule,
    SharedModule
]
})
export class AdminModule { }
