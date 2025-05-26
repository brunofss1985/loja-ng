import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/authService/auth.service';
import { LoginService } from 'src/app/core/services/loginService/login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
    private toastService: ToastrService,
    private authService: AuthService
  ) {}
  
  submit() {
    const { email, password } = this.loginForm.value;
    
    const loginObservable = this.loginService.login(email, password);
    
    loginObservable.subscribe({
      next: (res) => {
        this.toastService.success("Login feito com sucesso");
        const userType = this.authService.getUserType();
        
        if (userType === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (userType === 'USER') {
          this.router.navigate(['/user']);
        } else {
          this.router.navigate(['/']);
        }
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
