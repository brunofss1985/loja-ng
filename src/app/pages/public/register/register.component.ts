import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { LoginService } from 'src/app/core/services/loginService/login-service.service';
import { AuthService } from 'src/app/core/services/authService/auth.service';
import { UserService } from 'src/app/core/services/userService/user-service.service';

function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
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

  @Input() disabled: boolean = false; 
  @Output() registerSuccess = new EventEmitter<void>();

  @Input() userToEdit!: any;

  signupForm!: FormGroup;

  userAuth!: boolean;
  userType!: string | null;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastService: ToastrService,
    private authservice: AuthService,
    private userService: UserService
  ) {
    this.userAuth = this.authservice.isAuthenticated();
    this.userType = this.authservice.getUserType();

    this.signupForm = new FormGroup(
      {
        userType: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        passwordConfirm: new FormControl('', [Validators.required]),
      },
      { validators: passwordMatchValidator }
    );
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
        this.toastService.success('Registrado com sucesso!');
        this.registerSuccess.emit();
      },
      error: () => this.toastService.error('Erro no registro.'),
    });
  }

  navigate() {
    this.router.navigate(['']);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userToEdit'] && this.userToEdit) {
      this.signupForm.patchValue({
        name: this.userToEdit.name,
        email: this.userToEdit.email,
        userType: this.userToEdit.userType,
      });

      // Correctly disable controls from the component class
      this.signupForm.get('userType')?.disable();
      this.signupForm.get('name')?.disable();
      this.signupForm.get('email')?.disable();
      
    } else if (changes['userToEdit'] && !this.userToEdit) {
      // Correctly enable controls from the component class
      this.signupForm.get('userType')?.enable();
      this.signupForm.get('name')?.enable();
      this.signupForm.get('email')?.enable();
    }
  }

  resetForm() {
    this.signupForm.reset();
  }
}