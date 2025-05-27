import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/core/services/authService/auth.service';
import {
  User,
  UserService,
} from 'src/app/core/services/userService/user-service.service';
import { RegisterComponent } from '../../public/register/register.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  @ViewChild(RegisterComponent) registerComponent!: RegisterComponent;

  usuarioSelecionado: any = null;

  modalAberto!: boolean;
  tableName!: string;
  headers: string[] = [];
  users: User[] = [];
  isAdmin: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userType = this.authService.getUserType();
    this.isAdmin = userType === 'ADMIN';

    if (this.isAdmin) {
      this.loadUsers();
    }
  }

loadUsers(): void {
  this.userService.getAllUsers().subscribe({
    next: (data) => {
      this.users = data;
      this.headers = ['id', 'name', 'email', 'userType'];
    },
    error: (err) => console.error('Erro ao carregar usuários:', err),
  });
}

  deleteUser(id: string): void {
    if (confirm('Deseja realmente deletar este usuário?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Erro ao deletar usuário:', err),
      });
    }
  }

  onUserRegistered() {
    this.loadUsers(); // Atualiza a tabela
    this.modalAberto = false; // Fecha o modal
  }

  save(): void {
    if (this.registerComponent) {
      this.registerComponent.submit(this.usuarioSelecionado);
      this.registerComponent.resetForm();
    }
  }

  onEditUser(user: any) {
    this.usuarioSelecionado = user;
    this.modalAberto = true;
  }

  onModalFechado() {
    this.usuarioSelecionado = null;
    if (this.registerComponent) {
      this.registerComponent.resetForm();
    }
  }
}
