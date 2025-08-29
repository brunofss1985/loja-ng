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
        password: new FormControl('', [Validators.minLength(6)]),
        passwordConfirm: new FormControl(''),
      },
      { validators: passwordMatchValidator }
    );
  }

  submit(usuarioSelecionado?: any) {
    if (usuarioSelecionado) {
      // 💡 Se estiver em modo de edição, não faz nada com os dados do formulário.
      // O admin não deve alterar o usuário nessa tela.
      return;
    } else {
      // Lógica para novo cadastro
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

      // 💡 Desabilitar todos os controles do formulário no modo de edição
      this.signupForm.disable();
    } else if (changes['userToEdit'] && !this.userToEdit) {
      // 💡 Habilitar controles do formulário quando não está em modo de edição
      this.signupForm.enable();
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
    // Reativa a validação do formulário após o reset
    this.signupForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.signupForm.get('password')?.updateValueAndValidity();
    this.signupForm.get('passwordConfirm')?.setValidators([Validators.required]);
    this.signupForm.get('passwordConfirm')?.updateValueAndValidity();
  }
}