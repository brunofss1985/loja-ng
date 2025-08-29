import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/core/services/authService/auth.service';
import {
  User,
  UserService,
} from 'src/app/core/services/userService/user-service.service';
import { RegisterComponent } from '../../public/register/register.component';
// 💡 Importação e declaração corrigidas
import { ToastrService } from 'ngx-toastr';

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

  users: User[] = [];
  isAdmin: boolean = false;
  headers: string[] = ['id', 'name', 'email', 'userType'];
  columnLabels: { [key: string]: string } = {
    id: 'ID',
    name: 'Nome Completo',
    email: 'E-mail',
    userType: 'Tipo de Usuário',
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    // 💡 Declaração do tipo corrigida para ToastrService
    private toastr: ToastrService
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
      },
      error: (err) => console.error('Erro ao carregar usuários:', err),
    });
  }

  onUserRegistered() {
    this.loadUsers();
    this.modalAberto = false;
  }

  save(): void {
    if (this.registerComponent) {
      this.registerComponent.submit(this.usuarioSelecionado);
      this.registerComponent.resetForm();
    }
  }

  onEditUser(id: any) {
    this.usuarioSelecionado = id;
    this.modalAberto = true;
  }

  onDeleteUser(id: any) {
    const confirmar = confirm('Tem certeza que deseja deletar este item?');
    if (!confirmar) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.toastr.success(`Usuário ${id} deletado com sucesso`);
        this.loadUsers(); // Atualiza a lista
      },
      error: (error) => {
        this.toastr.error('Erro ao deletar usuário');
        console.error('Erro ao deletar usuário:', error);
      },
    });
  }

  onModalFechado() {
    this.usuarioSelecionado = null;
    if (this.registerComponent) {
      this.registerComponent.resetForm();
    }
  }

  formatUserCell(header: string, value: any) {
    if (header === 'id' && typeof value === 'string') {
      return value.slice(-4);
    }
    if (header === 'userType') {
      return value === 'ADMIN' ? 'Administrador' : 'Usuário';
    }
    return value ?? '';
  }
}