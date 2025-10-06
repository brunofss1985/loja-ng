import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService, User } from 'src/app/core/services/userService/user-service.service';

// 💡 Função de validação para comparar senhas
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const formGroup = control as FormGroup;
  const newPassword = formGroup.get('newPassword')?.value;
  const newPasswordConfirm = formGroup.get('newPasswordConfirm')?.value;

  if (newPassword === newPasswordConfirm) {
    return null;
  }
  return { passwordMismatch: true };
}

@Component({
  selector: 'app-perfil-admin',
  templateUrl: './perfil-admin.component.html',
  styleUrls: ['./perfil-admin.component.scss']
})
export class PerfilAdminComponent implements OnInit {
  perfilForm!: FormGroup;
  passwordForm!: FormGroup;
  currentUser: User = {
    name: '',
    email: '',
    userType: 'ADMIN',
    phone: '',
    address: ''
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Formulário de edição de perfil
    this.perfilForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userType: [{ value: '', disabled: true }],
      phone: [''],
      address: ['']
    });

    // 💡 Novo formulário para troca de senha com validação de confirmação
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPasswordConfirm: ['', Validators.required]
    }, { validators: passwordMatchValidator });

    this.carregarDadosDoUsuario();
  }

  carregarDadosDoUsuario(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.perfilForm.patchValue({
          name: user.name,
          email: user.email,
          userType: user.userType,
          phone: user.phone,
          address: user.address
        });
      },
      error: (err) => {
        console.error('Erro ao carregar dados do usuário:', err);
        this.toastr.error('Erro ao carregar seus dados.');
      }
    });
  }

  salvarPerfil(): void {
    if (this.perfilForm.invalid) {
      this.toastr.error('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    const updatedUser = { ...this.currentUser, ...this.perfilForm.value };

    this.userService.updateCurrentUser(updatedUser).subscribe({
      next: (user) => {
        this.toastr.success('Perfil atualizado com sucesso!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil:', err);
        this.toastr.error('Erro ao atualizar seu perfil.');
      }
    });
  }
  
  mudarSenha(): void {
    if (this.passwordForm.invalid) {
      this.toastr.error('Por favor, verifique se todos os campos de senha foram preenchidos corretamente.');
      return;
    }

    if (this.passwordForm.hasError('passwordMismatch')) {
      this.toastr.error('As senhas não coincidem.');
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.userService.updatePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.toastr.success('Senha alterada com sucesso!');
        this.passwordForm.reset();
      },
      error: (err) => {
        console.error('Erro ao alterar a senha:', err);
        this.toastr.error('Erro ao alterar a senha. Verifique se a senha atual está correta.');
      }
    });
  }
}