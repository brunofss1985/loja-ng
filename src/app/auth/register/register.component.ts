import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/loginService/login-service.service';
import { ToastrService } from 'ngx-toastr';


interface SignupForm {
  name: FormControl,
  email: FormControl,
  password: FormControl,
  passwordConfirm: FormControl,

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
      name: new FormControl('', [Validators.required, Validators.email]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.email])
    });
  }


  submit(): void {
    this.loginService.login(
      this.signupForm.value.name,
      this.signupForm.value.email,
      // this.signupForm.value.password,
      // this.signupForm.value.passwordConfirm
    ).subscribe({
      next: () => this.toastService.success("Login feito com Sucesso"),
      error: () => this.toastService.error("erro no login")
    })
  }

  navigate(): void {
    this.router.navigate(['login']);
  }
}
