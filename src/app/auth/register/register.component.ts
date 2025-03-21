import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  name: string = '';
  password: string = '';
  email: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    console.log("teste",this.authService.register(this.name, this.password, this.email))
    this.authService.register(this.name, this.password, this.email).subscribe(
      response => {
        console.log('Usuário registrado com sucesso:', response);
        this.router.navigate(['/login']); // Redireciona para login
      },
      error => {
        console.error('Erro no registro', error);
      }
    );
  }
}
