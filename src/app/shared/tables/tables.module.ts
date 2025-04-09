import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablesComponent } from './tables.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    TablesComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    TablesComponent
  ]
})
export class TablesModule { }
