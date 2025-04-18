import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/authService/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  userType!: string | null;
  menuItems: any[] = [];

  @Output() toggleSidebar = new EventEmitter<boolean>();
  isOpen = false;

  adminMenu = [
    { icon: 'fa-solid fa-face-smile', label: 'Perfil', route: '/admin/perfil' },
    { icon: 'fa-solid fa-circle-user', label: 'Usuários', route: '/admin/usuarios' },
    { icon: 'fas fa-box', label: 'Estoque', route: '/admin/estoque' },
    { icon: 'fas fa-shopping-cart', label: 'Compras', route: '/admin/compras' },
    { icon: 'fas fa-clipboard-list', label: 'Produtos', route: '/admin/produtos' },
    { icon: 'fas fa-home', label: 'caixa', route: '/admin/caixa' }
  ];

  userMenu = [
    { icon: 'fas fa-user', label: 'Perfil', route: '/user/perfil' },
    { icon: 'fas fa-shopping-cart', label: 'Meus Pedidos', route: '/user/meus-pedidos' }
  ];

  constructor(private route: Router, private authServ: AuthService) { }

  ngOnInit(): void {
    this.userType = this.authServ.getUserType();
    this.menuItems = this.userType === 'ADMIN' ? this.adminMenu : this.userMenu;
  }

  onMouseEnter() {
    this.isOpen = true;
    this.toggleSidebar.emit(this.isOpen);
  }

  onMouseLeave() {
    this.isOpen = false;
    this.toggleSidebar.emit(this.isOpen);
  }

  exit() {
    localStorage.clear();
    this.route.navigate(['']);
  }
}
