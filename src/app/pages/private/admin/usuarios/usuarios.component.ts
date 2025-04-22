import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/authService/auth.service';
import { User, UserService } from 'src/app/auth/services/userService/user-service.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

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
        this.users = data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType
        }));
  
        if (data.length > 0) {
          this.headers = ['id', 'name', 'email', 'userType'];
        }
      },
      error: (err) => console.error('Erro ao carregar usuários:', err)
    });
  }

  deleteUser(id: string): void {
    if (confirm('Deseja realmente deletar este usuário?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Erro ao deletar usuário:', err)
      });
    }
  }

  modalAberto = false;

  abrirCadastro() {
    this.modalAberto = true;
  }
}
