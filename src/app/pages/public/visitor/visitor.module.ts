import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitorRoutingModule } from './visitor-routing.module';
import { VisitorComponent } from './visitor.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProdutosComponent } from './produtos/produtos.component';

@NgModule({
  declarations: [
    VisitorComponent,
    ProdutosComponent
  ],
  imports: [
    
    CommonModule,
    VisitorRoutingModule,
    SharedModule
  ]
})
export class VisitorModule { }
