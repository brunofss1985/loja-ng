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
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastService: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  submit() {
    const { email, password } = this.loginForm.value;
    this.loginService.login(email, password).subscribe({
      next: () => {
        this.toastService.success("Login feito com sucesso");
        this.router.navigate(['/home-admin']); // redireciona após login
      },
      error: () => this.toastService.error("Erro no login")
    });
  }
  

  navigate() {
    this.router.navigate([""])
  }
}
