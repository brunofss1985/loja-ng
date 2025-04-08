import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/loginService/login-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  errorMessage: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastService: ToastrService
  ) {}

  submit() {
    const { email, password } = this.loginForm.value;
  
    const loginObservable = this.loginService.login(email, password);
  
    loginObservable.subscribe({
      next: (res) => {
        this.toastService.success("Login feito com sucesso");
        this.router.navigate(['/home-user']);
      },
      error: (err) => {
        console.error('Erro:', err);
        this.toastService.error("Erro ao fazer login");
      }
    });
  }
  

  navigate() {
    this.router.navigate([""]);
  }
}

