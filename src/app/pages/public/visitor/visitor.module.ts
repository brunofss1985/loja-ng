import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitorRoutingModule } from './visitor-routing.module';
import { VisitorComponent } from './visitor.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProdutosComponent } from './produtos/produtos.component';
import { RegisterComponent } from '../../../shared/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    VisitorComponent,
    ProdutosComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    VisitorRoutingModule,
    SharedModule,

  ],
  exports:[
  ]
})
export class VisitorModule { }
