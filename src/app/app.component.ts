import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './core/services/authService/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'loja';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.sessionExpired$.subscribe((expired) => {
      if (expired) {
        console.log('⚠️ Sessão expirada detectada — exibindo alerta');
        this.showSessionExpiredModal();
      }
    });
  }

  private showSessionExpiredModal(): void {
    Swal.fire({
      icon: 'warning',
      title: 'Sessão Expirada',
      text: 'Sua sessão expirou. Deseja fazer login novamente?',
      showCancelButton: true,
      confirmButtonText: 'Sim, quero entrar',
      cancelButtonText: 'Não, voltar para home',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      allowOutsideClick: false,
      backdrop: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const returnUrl = this.authService.getReturnUrl();
        this.router.navigate(['/default-login/login'], {
          queryParams: { returnUrl },
        });
      } else {
        this.router.navigate(['/']);
      }

      // ✅ Resetar para que não exiba novamente
      this.authService.resetSessionExpired();
    });
  }
}
