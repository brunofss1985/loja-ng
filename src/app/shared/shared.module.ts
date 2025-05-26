import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DefaultLoginComponent } from './components/default-login/default-login.component';
import { RouterModule } from '@angular/router';
import { TablesComponent } from './components/tables/tables.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { ModalComponent } from './components/modal/modal.component';
import { DeleteButtonComponent } from './components/delete-button/delete-button.component';
import { EditButtonComponent } from './components/edit-button/edit-button.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DefaultLoginComponent,
    InputTextComponent,
    TablesComponent,
    SidebarComponent,
    ModalComponent,
    DeleteButtonComponent,
    EditButtonComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    DefaultLoginComponent,
    InputTextComponent,
    TablesComponent,
    SidebarComponent,
    ModalComponent,
    DeleteButtonComponent
  ]
})
export class SharedModule { }
