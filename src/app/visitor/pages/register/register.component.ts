import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AbstractControl, ValidationErrors } from '@angular/forms';
import { LoginService } from 'src/app/auth/services/loginService/login-service.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const formGroup = control as FormGroup;
  const password = formGroup.get('password')?.value;
  const passwordConfirm = formGroup.get('passwordConfirm')?.value;

  return password === passwordConfirm ? null : { passwordMismatch: true };
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  signupForm!: FormGroup

  constructor(private loginService: LoginService, private router: Router, private toastService: ToastrService) {
    this.signupForm = new FormGroup({
      userType: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required])
    },{ validators: passwordMatchValidator });;
  }

  submit() {
    if (this.signupForm.invalid) {
      this.toastService.error('Preencha corretamente todos os campos.');
      return;
    }
  
    if (this.signupForm.hasError('passwordMismatch')) {
      this.toastService.error('As senhas não coincidem.');
      return;
    }
  
    const { name, email, password, userType } = this.signupForm.value;
  
    this.loginService.register(name, email, password, userType).subscribe({
      next: () => {
        this.toastService.success("Registrado com sucesso!");
        this.router.navigate(['visitor/login']);
      },
      error: () => this.toastService.error("Erro no registro")
    });
  }
  

  navigate(): void {
    this.router.navigate(['visitor']);
  }
}
