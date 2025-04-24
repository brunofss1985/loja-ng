import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { AdminComponent } from './admin.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AdminComponent,
    UsuariosComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AdminRoutingModule,
    SharedModule,
]
})
export class AdminModule { }
