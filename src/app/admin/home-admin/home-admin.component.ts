import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/auth/services/loginService/login-service.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss']
})
export class HomeAdminComponent implements OnInit {

  users: any[] = [];

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    //   this.loginService.getUsers().subscribe({
    //     next: (data) => {
    //       this.users = data;
    //     },
    //     error: (error) => {
    //       console.error('Erro ao buscar usuários:', error);
    //     }
    //   });
  }
}


