// perfil.component.ts (mantém o mesmo código da resposta anterior)
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  profileForm!: FormGroup;
  orders: Order[] = [];
  
  isModalOpen: boolean = false;

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
      credits: 0
    });
    this.user = this.authService.getUser();

    if (this.user?.email) {
      this.loadOrders(this.user.email);
    }
  
    this.userService.getCurrentUser().subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.initForm(user);

        if (user.email) {
          this.orderService.getLastOrder(user.email).subscribe((order) => {
            this.lastOrder = order;
          });
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
      }
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
        }
      });
    }
  }

  initForm(user: User): void {
    this.profileForm = this.fb.group({
      name: [user.name || '', Validators.required],
      email: [{ value: user.email || '', disabled: true }, [Validators.required, Validators.email]],
      phone: [user.phone || ''],
      address: [user.address || ''],
      points: [user.points || 0],
      credits: [user.credits || 0]
    });
  }

  saveProfile(): void {
    if (!this.profileForm) return;

    const updatedUser: User = {
      ...this.user,
      ...this.profileForm.getRawValue()
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
      }
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }
}