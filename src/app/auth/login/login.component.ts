import { Component } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Inicializando o formulário com e-mail e senha
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Validações para e-mail
      password: ['', [Validators.required, Validators.minLength(6)]] // Validações para senha
    });
  }

  // Método para realizar o login
  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    //Exemplo de lógica de autenticação (serviço comentado para ser implementado posteriormente)
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
          this.router.navigate(['/home-admin']); // Redireciona para a página inicial após o login
       },
       error: (err) => {
         this.errorMessage = 'Credenciais inválidas'; // Exibe mensagem de erro caso as credenciais estejam erradas
       }
    });
  }
}
