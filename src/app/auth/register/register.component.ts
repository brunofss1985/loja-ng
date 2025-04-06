import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/loginService/login-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  signupForm!: FormGroup

  constructor(private loginService: LoginService, private router: Router, private toastService: ToastrService) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required])
    });
  }

  submit() {
    const { name, email, password } = this.signupForm.value;
    this.loginService.register(name, email, password).subscribe({
      next: () => {
        this.toastService.success("Registrado com sucesso!");
        this.router.navigate(['/login']);
      },
      error: () => this.toastService.error("Erro no registro")
    });
  }

  navigate(): void {
    this.router.navigate(['login']);
  }
}
