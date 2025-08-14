import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { OrderService } from 'src/app/core/services/orderService/order-service';
import { AuthService } from 'src/app/core/services/authService/auth.service';
import {
  User,
  UserService,
} from 'src/app/core/services/userService/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/core/models/order.model ';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  lastOrder?: Order;
  activeTab: string = 'visao-geral';
  user?: User;

  profileForm?: FormGroup;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private userService: UserService,
    private toast: ToastrService
  ) {}

ngOnInit(): void {
  const userEmail = this.authService.getUser()?.email;

  // Inicializa o formulário vazio
  this.initForm({
    name: '',
    email: userEmail || '',
    phone: '',
    address: '',
    id: '', // ou null, dependendo do seu modelo
  });

  if (userEmail) {
    this.orderService.getLastOrder(userEmail).subscribe((order) => {
      this.lastOrder = order;
    });

    this.userService.getUserByEmail(userEmail).subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.initForm(user); // atualiza com dados reais
      }
    });
  }
}


  setTab(tabName: string): void {
    this.activeTab = tabName;
  }

  initForm(user: User): void {
    this.profileForm = new FormGroup({
      name: new FormControl(user.name),
      email: new FormControl(user.email),
      phone: new FormControl(user.phone || ''),
      address: new FormControl(user.address || ''),
    });
  }

  saveProfile(): void {
    if (!this.user || !this.profileForm) return;

    const updatedUser: User = {
      ...this.user,
      ...this.profileForm.value,
    };

    if (this.user.id) {
      this.userService.updateUser(this.user.id, updatedUser).subscribe({
        next: () => {
          this.toast.success('Perfil atualizado com sucesso!');
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Erro ao atualizar perfil.');
        },
      });
    }
  }

  closeModal(): void {
    const modalCheckbox = document.getElementById('modalEdit') as HTMLInputElement;
    if (modalCheckbox) {
      modalCheckbox.checked = false;
    }
  }
}
