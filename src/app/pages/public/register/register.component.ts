import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AbstractControl, ValidationErrors } from '@angular/forms';
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
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        passwordConfirm: new FormControl('', [Validators.required]),
      },
      { validators: passwordMatchValidator }
    );
  }

  submit(usuarioSelecionado?: any) {
    if (this.signupForm.invalid) {
      this.toastService.error('Preencha corretamente todos os campos.');
      return;
    }

    if (this.signupForm.hasError('passwordMismatch')) {
      this.toastService.error('As senhas não coincidem.');
      return;
    }

    const { name, email, password, userType } = this.signupForm.value;

    if (usuarioSelecionado) {
      // Edição
      const userId = usuarioSelecionado.id;
      const updatedUser = { name, email, password, userType };

      this.userService.updateUser(userId, updatedUser).subscribe({
        next: () => {
          this.toastService.success('Usuário atualizado com sucesso!');
          this.registerSuccess.emit();
          window.location.reload(); // Solução rápida para limpar o formulario (atualiza toda a pagina - nao recomendado)

        },
        error: () => this.toastService.error('Erro ao atualizar o usuário.'),
      });
    } else {
      // Novo cadastro
      this.loginService.register(name, email, password, userType).subscribe({
        next: () => {
          this.toastService.success('Registrado com sucesso!');
          this.registerSuccess.emit();
        },
        error: () => this.toastService.error('Erro no registro.'),
      });
    }
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
    }
  }

  resetForm() {
    this.signupForm.reset({
      userType: '',
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    });
  }
}
