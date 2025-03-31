import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { HomeAdminComponent } from 'src/app/admin/home-admin/home-admin.component';



@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [SidebarComponent]
})
export class SidebarModule { }
