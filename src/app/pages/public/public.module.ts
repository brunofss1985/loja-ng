import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { PublicHomeComponent } from './public-home/public-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublicRoutingModule } from './public-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { PublicComponent } from './public.component';
import { ChatComponent } from './chat/chat.component';



@NgModule({
  declarations: [
    PublicComponent,
    LoginComponent,
    PublicHomeComponent,
    RegisterComponent,
    ChatComponent,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    
    
  ],
  exports: [
    RegisterComponent,
    ChatComponent
  ]
})
export class PublicModule { }
