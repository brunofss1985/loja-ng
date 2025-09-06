import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { OrderService } from 'src/app/core/services/orderService/order-service';
import { AuthService } from 'src/app/core/services/authService/auth.service';
import {
  User,
  UserService,
  PasswordCreation, // Importe a nova interface
} from 'src/app/core/services/userService/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/core/models/order.model ';

// Função de validação customizada para checar se as senhas coincidem
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  return newPassword &&
    confirmPassword &&
    newPassword.value === confirmPassword.value
    ? null
    : { passwordMismatch: true };
};

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  lastOrder?: Order;
  activeTab: string = 'visao-geral';
  user?: User;
  profileForm!: FormGroup;
  passwordForm!: FormGroup; // Formulário para trocar senha (com senha antiga)
  setPasswordForm!: FormGroup; // Formulário para criar senha (sem senha antiga)
  orders: Order[] = [];

  isModalOpen: boolean = false;
  hasPassword: boolean = false; // 🎯 Variável para controlar a lógica

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private authService: AuthService,
    private userService: UserService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      points: 0,
      credits: 0,
    }); // A inicialização dos formulários de senha será feita dentro da inscrição do usuário

    this.userService.getCurrentUser().subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.initForm(user);

        // 🎯 Lógica para determinar se o usuário já tem senha
        this.hasPassword = user.password !== null && user.password !== '';

        // 🎯 Inicializa o formulário de senha correto
        if (this.hasPassword) {
          this.initPasswordChangeForm();
        } else {
          this.initPasswordSetForm();
        }

        if (user.email) {
          this.orderService.getLastOrder(user.email).subscribe((order) => {
            this.lastOrder = order;
          });
          this.loadOrders(user.email);
        }
      }
    });
  }

  private loadOrders(userId: string): void {
    this.orderService.getLastOrder(userId).subscribe({
      next: (order) => {
        if (order) {
          this.orders = [order];
        }
      },
      error: (err) => {
        console.error('❌ Erro ao buscar pedidos:', err);
      },
    });
  }

  setTab(tabName: string): void {
    this.activeTab = tabName;

    if (tabName === 'pedidos' && this.user?.email) {
      this.orderService.getAllOrders(this.user.email).subscribe({
        next: (orders: Order[]) => {
          this.orders = orders;
        },
        error: (err) => {
          console.error('Erro ao carregar pedidos:', err);
          this.toast.error('Não foi possível carregar seus pedidos.');
        },
      });
    }
  }

  initForm(user: User): void {
    this.profileForm = this.fb.group({
      name: [user.name || '', Validators.required],
      email: [
        { value: user.email || '', disabled: true },
        [Validators.required, Validators.email],
      ],
      phone: [user.phone || ''],
      address: [user.address || ''],
      points: [user.points || 0],
      credits: [user.credits || 0],
    });
  }

  // 🎯 Renomeado para maior clareza
  initPasswordChangeForm(): void {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  // 🎯 Novo método para inicializar o formulário de criação de senha
  initPasswordSetForm(): void {
    this.setPasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  saveProfile(): void {
    if (!this.profileForm) return;

    const updatedUser: User = {
      ...this.user,
      ...this.profileForm.getRawValue(),
    };

    this.userService.updateCurrentUser(updatedUser).subscribe({
      next: (res: User) => {
        this.toast.success('Perfil atualizado com sucesso!');
        this.user = res;
        this.isModalOpen = false;
      },
      error: (err: any) => {
        console.error(err);
        this.toast.error('Erro ao atualizar perfil.');
      },
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.toast.error('Por favor, verifique os campos do formulário.');
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.userService
      .updatePassword({ currentPassword, newPassword })
      .subscribe({
        next: () => {
          this.toast.success('Senha alterada com sucesso!');
          this.passwordForm.reset();
        },
        error: (err) => {
          console.error('Erro ao alterar senha:', err);
          const errorMessage =
            err.error?.message ||
            'Erro ao alterar senha. Por favor, tente novamente.';
          this.toast.error(errorMessage);
        },
      });
  }

  // 🎯 Novo método para criar a senha
  setPassword(): void {
    if (this.setPasswordForm.invalid) {
      this.toast.error('Por favor, verifique os campos do formulário.');
      return;
    }

    const { newPassword } = this.setPasswordForm.value;

    this.userService.setPassword({ newPassword }).subscribe({
      next: () => {
        this.toast.success(
          'Senha criada com sucesso! Agora você pode usar e-mail e senha para fazer login.'
        );
        this.setPasswordForm.reset();
        this.hasPassword = true; // 🎯 Atualiza o estado
        this.initPasswordChangeForm(); // 🎯 Inicializa o formulário de troca de senha
      },
      error: (err) => {
        console.error('Erro ao criar senha:', err);
        const errorMessage =
          err.error?.message ||
          'Erro ao criar senha. Por favor, tente novamente.';
        this.toast.error(errorMessage);
      },
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }
}
